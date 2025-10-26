const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      this.client = redis.createClient({
        url: redisUrl,
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            console.error('Redis server connection refused');
            return new Error('Redis server connection refused');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            console.error('Redis retry time exhausted');
            return new Error('Redis retry time exhausted');
          }
          if (options.attempt > 10) {
            console.error('Redis max retry attempts reached');
            return undefined;
          }
          return Math.min(options.attempt * 100, 3000);
        }
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
      throw error;
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
    if (!this.isConnected) return null;
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
    if (!this.isConnected) return null;
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async del(key) {
    if (!this.isConnected) return false;
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  }

  async exists(key) {
    if (!this.isConnected) return false;
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
    if (!this.isConnected) return 0;
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
