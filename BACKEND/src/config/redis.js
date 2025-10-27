// Redis is optional in some deployments (e.g., Render without Redis add-on).
// If the module isn't installed or no URL is provided, we export a no-op client
// that preserves the public API and avoids crashing the app.

let redisLib = null;
try {
  // Attempt to load the redis library if available
  // This will throw if not installed; we will fall back to a no-op client
  redisLib = require('redis');
} catch (e) {
  // Intentionally ignore; we'll use a no-op below
}

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.isEnabled = Boolean(redisLib) && Boolean(process.env.REDIS_URL);
  }

  async connect() {
    try {
      if (!this.isEnabled) {
        console.warn('Redis disabled: missing module or REDIS_URL env. Running without Redis.');
        return false;
      }

      const redisUrl = process.env.REDIS_URL;

      this.client = redisLib.createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
        },
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis Client Connected');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        console.log('Redis Client Ready');
        this.isConnected = true;
      });

      this.client.on('end', () => {
        console.log('Redis Client Disconnected');
        this.isConnected = false;
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      // Do not crash the app; keep running without Redis
      this.isEnabled = false;
      this.client = null;
      this.isConnected = false;
      return false;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  // Cache methods
  async set(key, value, expireInSeconds = 3600) {
    if (!this.isConnected || !this.client) return null;
    try {
      const serializedValue = JSON.stringify(value);
      await this.client.setEx(key, expireInSeconds, serializedValue);
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  }

  async get(key) {
    if (!this.isConnected || !this.client) return null;
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async del(key) {
    if (!this.isConnected || !this.client) return false;
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  }

  async exists(key) {
    if (!this.isConnected || !this.client) return false;
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  }

  // Session management
  async setSession(sessionId, userData, expireInSeconds = 86400) { // 24 hours
    return await this.set(`session:${sessionId}`, userData, expireInSeconds);
  }

  async getSession(sessionId) {
    return await this.get(`session:${sessionId}`);
  }

  async deleteSession(sessionId) {
    return await this.del(`session:${sessionId}`);
  }

  // User data caching
  async setUserData(userId, userData, expireInSeconds = 1800) { // 30 minutes
    return await this.set(`user:${userId}`, userData, expireInSeconds);
  }

  async getUserData(userId) {
    return await this.get(`user:${userId}`);
  }

  async deleteUserData(userId) {
    return await this.del(`user:${userId}`);
  }

  // Presence management
  async setUserPresence(userId, socketId, expireInSeconds = 300) { // 5 minutes
    return await this.set(`presence:${userId}`, socketId, expireInSeconds);
  }

  async getUserPresence(userId) {
    return await this.get(`presence:${userId}`);
  }

  async deleteUserPresence(userId) {
    return await this.del(`presence:${userId}`);
  }

  // Message caching
  async setRecentMessages(userId1, userId2, messages, expireInSeconds = 3600) {
    const key = `messages:${userId1}:${userId2}`;
    return await this.set(key, messages, expireInSeconds);
  }

  async getRecentMessages(userId1, userId2) {
    const key = `messages:${userId1}:${userId2}`;
    return await this.get(key);
  }

  // Rate limiting
  async incrementRateLimit(key, expireInSeconds = 60) {
    if (!this.isConnected || !this.client) return 0;
    try {
      const current = await this.client.incr(key);
      if (current === 1) {
        await this.client.expire(key, expireInSeconds);
      }
      return current;
    } catch (error) {
      console.error('Redis rate limit error:', error);
      return 0;
    }
  }

  // Pub/Sub methods
  async publish(channel, message) {
    if (!this.isConnected) return false;
    try {
      await this.client.publish(channel, JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Redis PUBLISH error:', error);
      return false;
    }
  }

  async subscribe(channel, callback) {
    if (!this.isConnected) return false;
    try {
      await this.client.subscribe(channel, callback);
      return true;
    } catch (error) {
      console.error('Redis SUBSCRIBE error:', error);
      return false;
    }
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
