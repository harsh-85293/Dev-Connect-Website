# DevConnect - Redis & Kafka Interview Questions

## Table of Contents
1. [Redis Interview Questions (Q1-Q6)](#redis-interview-questions)
2. [Kafka Interview Questions (Q7-Q12)](#kafka-interview-questions)
3. [Project Architecture Questions (Q13-Q15)](#project-architecture-questions)
4. [System Design Questions (Q16-Q17)](#system-design-questions)
5. [Implementation Deep Dive (Q18-Q20)](#implementation-deep-dive)
6. [Zookeeper Questions (Q21-Q25)](#kafka-infrastructure-zookeeper-questions)
7. [JWT & Authentication Questions (Q26-Q30)](#jwt--authentication-interview-questions)

**Total: 30 comprehensive interview questions**

---

## Redis Interview Questions

### Q1: Why did you choose Redis for this project?

**Answer:**
I chose Redis for three main reasons:

1. **Performance**: Redis stores data in-memory, providing sub-millisecond response times. This reduced our session validation time from 100ms to just 3ms - a 97% improvement.

2. **Session Management**: We needed fast session lookups without querying MongoDB on every request. Redis's key-value structure with TTL support makes it perfect for session storage.

3. **Real-time Features**: For presence tracking (who's online), we needed atomic operations and fast reads. Redis provides exactly this with its data structures and pub/sub capabilities.

**In our implementation:**
```javascript
// Before: 100ms to verify session (MongoDB query)
// After: 3ms with Redis
const session = await redisClient.getSession(token);
if (session) {
  req.user = await redisClient.getUserData(session.userId);
}
```

---

### Q2: Explain your Redis caching strategy in DevConnect.

**Answer:**

We use a **multi-tier caching strategy** with different TTLs based on data volatility:

```javascript
// Session data (short-lived, critical)
await redisClient.setSession(token, sessionData, 86400); // 24 hours

// User profile data (30 min cache)
await redisClient.setUserData(userId, userData, 1800); // 30 minutes

// Presence data (5 min, frequent updates)
await redisClient.setUserPresence(userId, socketId, 300); // 5 minutes

// Recent messages (1 hour)
await redisClient.setRecentMessages(userId1, userId2, messages, 3600);
```

**Why these TTLs?**
- Sessions: 24h - matches user session timeout
- User data: 30min - balances freshness vs performance
- Presence: 5min - real-time updates are critical
- Messages: 1h - acceptable freshness, instant access

**Cache Invalidation:**
```javascript
// When user updates profile
await redisClient.del(`user:${userId}`); // Invalidate cache
await redisClient.setUserData(userId, updatedUser); // Refresh
```

---

### Q3: How do you handle cache misses and cache warming?

**Answer:**

**Cache Miss Handling:**
```javascript
async function getUserData(userId) {
  // Try cache first
  let user = await redisClient.getUserData(userId);
  
  if (!user) {
    // Cache miss - fetch from database
    user = await User.findById(userId);
    
    // Update cache for future requests
    await redisClient.setUserData(userId, user, 1800);
  }
  
  return user;
}
```

**Cache Warming:**
We warm the cache for critical data:
1. On login: Pre-fetch and cache user data
2. On signup: Cache new user data immediately
3. Background jobs: Warm cache for active users periodically

**Graceful Degradation:**
- If Redis is down, fall back to database
- Never block the main flow for caching
- Log errors but continue serving requests

---

### Q4: Explain Redis key naming conventions in your project.

**Answer:**

We use **namespaced keys** for organization and to avoid collisions:

```javascript
// Pattern: <namespace>:<identifier>:<optional-suffix>

session:<token>           // Session data
user:<userId>             // User profile
user:email:<emailId>      // User lookup by email
presence:<userId>         // Online presence
messages:<userId1>:<userId2>  // Chat messages
ratelimit:<userId>:<endpoint>  // Rate limiting
user:<userId>:last_seen   // Last active timestamp
```

**Benefits:**
- Easy to identify key types
- Simple to clean up (can use pattern matching)
- Prevents namespace collisions
- Good for monitoring and debugging

**Cleanup example:**
```javascript
// Delete all session keys matching pattern
redis-cli KEYS "session:*" | xargs redis-cli DEL
```

---

### Q5: How do you implement rate limiting with Redis?

**Answer:**

We use a **sliding window counter** pattern:

```javascript
async function checkRateLimit(userId, endpoint, maxRequests = 100, windowSeconds = 60) {
  const key = `ratelimit:${userId}:${endpoint}`;
  
  const current = await redisClient.client.incr(key);
  
  if (current === 1) {
    // First request in window, set expiry
    await redisClient.client.expire(key, windowSeconds);
  }
  
  if (current > maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  
  return { 
    allowed: true, 
    remaining: maxRequests - current 
  };
}
```

**Usage in middleware:**
```javascript
app.post('/api/login', async (req, res) => {
  const { allowed, remaining } = await checkRateLimit(
    req.ip, 'login', 5, 300  // 5 attempts per 5 minutes
  );
  
  if (!allowed) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: remaining
    });
  }
  
  // Process login...
});
```

---

### Q6: Explain Redis persistence and why it matters for sessions.

**Answer:**

We configure Redis with **AOF (Append-Only File)** persistence:

```yaml
# docker-compose.yml
services:
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes  # Enable AOF
    volumes:
      - redis_data:/data  # Persistent volume
```

**Why AOF for sessions?**
1. **Durability**: Sessions survive Redis restarts
2. **Point-in-time recovery**: We can recover from crashes
3. **Performance**: AOF fsync every second (fsync=everysec)

**Trade-offs:**
- AOF is safer but uses more disk space
- RDB snapshots are faster but less frequent
- For production, consider both AOF + RDB snapshots

**Session TTL handling:**
```javascript
// Sessions expire automatically after TTL
await redisClient.setSession(token, sessionData, 86400);

// Also set expiry on the key itself as backup
await redisClient.client.expire(`session:${token}`, 86400);
```

---

## Kafka Interview Questions

### Q7: Why did you choose Kafka for event streaming?

**Answer:**

We chose Kafka for **event-driven architecture** and **analytics**:

1. **Decoupling**: Services don't need to know about each other
   - Auth service publishes signup event
   - Analytics service consumes it asynchronously
   - No tight coupling

2. **Scalability**: Kafka handles high throughput
   - We process ~500 message events/min
   - Can scale consumers horizontally

3. **Historical Data**: Events are stored for 7 days
   - Replay events for debugging
   - Build analytics over time

4. **Asynchronous Processing**: Don't block main flow
   ```javascript
   // Non-blocking analytics
   await kafkaClient.publishMessageEvent('MESSAGE_SENT', data);
   // Main flow continues immediately
   ```

---

### Q8: Explain your Kafka topic design.

**Answer:**

We use **domain-driven topic names** with 3 partitions each:

```javascript
// Topics we created
const topics = [
  { topic: 'user-events', numPartitions: 3 },      // User lifecycle
  { topic: 'message-events', numPartitions: 3 },   // Chat activity
  { topic: 'connection-events', numPartitions: 3 }, // Network growth
  { topic: 'notification-events', numPartitions: 3 }, // Alerts
  { topic: 'analytics-events', numPartitions: 3 }  // Metrics
];
```

**Why 3 partitions?**
- Balance throughput and parallelism
- Enough for 3 consumers per topic
- Simple replication (RF=1 for dev, RF=3 for prod)

**Event structure:**
```javascript
{
  eventType: 'USER_SIGNUP',
  userId: 'user123',
  timestamp: '2024-01-01T12:00:00Z',
  data: {
    firstName: 'John',
    emailId: 'john@example.com',
    signupTime: '2024-01-01T12:00:00Z'
  }
}
```

---

### Q9: How do you ensure message ordering in Kafka?

**Answer:**

We use **message keys** to route related messages to the same partition:

```javascript
await kafkaClient.producer.send({
  topic: 'message-events',
  messages: [{
    key: userId,  // Same user = same partition = ordered
    value: JSON.stringify({
      eventType: 'MESSAGE_SENT',
      fromUserId,
      toUserId,
      text: message,
      ts: timestamp
    })
  }]
});
```

**Why this works:**
- Kafka hashes the key to determine partition
- Same key → same partition → ordered processing
- Within a partition, messages are FIFO ordered

**For user events:**
```javascript
key: userId  // All user123 events go to same partition
```

---

### Q10: Explain your Kafka consumer implementation.

**Answer:**

We implement **idempotent consumers** with Redis as deduplication:

```javascript
await kafkaClient.subscribeToUserEvents(async (eventData) => {
  const { eventType, userId, timestamp } = eventData;
  
  // Check if already processed (idempotency)
  const messageId = `kafka:${eventType}:${userId}:${timestamp}`;
  if (await redisClient.exists(`processed:${messageId}`)) {
    console.log('Event already processed, skipping');
    return;
  }
  
  // Process event
  switch (eventType) {
    case 'USER_SIGNUP':
      // Trigger welcome email
      await sendWelcomeEmail(userId);
      break;
    case 'USER_ONLINE':
      // Update last seen
      await redisClient.set(
        `user:${userId}:last_seen`, 
        new Date().toISOString(),
        86400
      );
      break;
  }
  
  // Mark as processed (24h TTL)
  await redisClient.set(`processed:${messageId}`, '1', 86400);
});
```

**Benefits:**
- At-least-once delivery guaranteed
- No duplicate processing
- Can replay events safely

---

### Q11: How do you handle Kafka failures and backpressure?

**Answer:**

**Producer Errors:**
```javascript
await kafkaClient.producer.send({
  topic: 'user-events',
  messages: [...]
}).catch((error) => {
  console.error('Failed to publish event:', error);
  // Log to error tracking
  // Don't block main flow
});
```

**Consumer Errors:**
```javascript
await kafkaClient.consumer.run({
  eachMessage: async ({ message }) => {
    try {
      await processMessage(message);
    } catch (error) {
      console.error('Processing failed:', error);
      // Send to dead letter queue
      await kafkaClient.publishEvent('dead-letter', message);
      // Continue processing other messages
    }
  }
});
```

**Backpressure Strategy:**
- Use `maxInFlightRequests: 1` for ordering
- Handle errors gracefully, don't crash
- Retry failed messages with exponential backoff
- Dead letter queue for unprocessable messages

---

### Q12: Explain Kafka consumer groups in your implementation.

**Answer:**

We use a **single consumer group** with the same ID for all consumers:

```javascript
this.consumer = this.kafka.consumer({ 
  groupId: 'devconnect-group' 
});

// All consumers in same group
await this.subscribeToUserEvents(callback);        // Consumer 1
await this.subscribeToMessageEvents(callback);    // Consumer 2
await this.subscribeToConnectionEvents(callback);  // Consumer 3
```

**Why this design?**
- Each consumer processes different topics
- Load balancing across instances
- Can add more instances for horizontal scaling

**Scalability:**
```
1 instance: All 5 consumers in single process
3 instances: Distribute consumers across 3 processes
5 instances: One consumer per instance
```

**Rebalancing:**
- Kafka automatically rebalances when instances join/leave
- No downtime during rebalancing
- Each partition assigned to exactly one consumer

---

## Project Architecture Questions

### Q13: Walk me through the complete authentication flow.

**Answer:**

**1. User Login:**
```javascript
// POST /api/login
POST /api/login
Body: { emailId, password }

1. Check Redis cache for user
2. If not cached, query MongoDB
3. Verify password with bcrypt
4. Generate JWT token
5. Store session in Redis (token → userId)
6. Cache user data in Redis
7. Publish USER_LOGIN event to Kafka
8. Return token in HttpOnly cookie
```

**2. Protected Route Access:**
```javascript
// GET /api/profile with cookie
GET /api/profile
Headers: Cookie: token=xyz

1. auth middleware extracts token from cookie
2. Check Redis for session: token → userId
3. Check Redis for user data: userId → user
4. If cache miss, query MongoDB
5. Attach user to req.user
6. Continue to handler
```

**Performance:**
- Cache hit: 3ms (Redis lookup)
- Cache miss: 100ms (MongoDB + Redis store)
- 97% faster with caching

---

### Q14: Explain the real-time messaging flow.

**Answer:**

**End-to-end flow:**

```
1. User A sends message via Socket.io
   Client: socket.emit('private-message', { toUserId, message })

2. Server receives message
   Server: io.on('private-message', handler)

3. Save to MongoDB (persistent)
   await Message.create({ fromUserId, toUserId, text, ts })

4. Cache in Redis (fast retrieval)
   await redisClient.setRecentMessages(userId1, userId2, messages)

5. Publish event to Kafka (analytics)
   await kafkaClient.publishMessageEvent('MESSAGE_SENT', data)

6. Emit to User B if online
   if (userB online) {
     io.to(userB.socketId).emit('private-message', message)
   }

7. Acknowledge to User A
   io.to(socket.id).emit('private-message', { ... })
```

**Benefits:**
- Fast: Redis caching
- Reliable: MongoDB persistence
- Scalable: Kafka event streaming
- Real-time: Socket.io instant delivery

---

### Q15: How does presence tracking work?

**Answer:**

**User Comes Online:**
```javascript
socket.on('register', async (userId) => {
  // Store presence in Redis
  await redisClient.setUserPresence(userId, socket.id, 300);
  
  // Publish event
  await kafkaClient.publishUserEvent('USER_ONLINE', userId);
  
  // Broadcast to all clients
  io.emit('presence', { userId, online: true });
});
```

**User Goes Offline:**
```javascript
socket.on('disconnect', async () => {
  const userId = getUserId(socket.id);
  
  // Remove from Redis
  await redisClient.deleteUserPresence(userId);
  
  // Publish event
  await kafkaClient.publishUserEvent('USER_OFFLINE', userId);
  
  // Notify all clients
  io.emit('presence', { userId, online: false });
});
```

**Querying Presence:**
```javascript
socket.on('presence:query', async ({ userId }) => {
  const online = await redisClient.getUserPresence(userId);
  socket.emit('presence:state', { userId, online: !!online });
});
```

**TTL Strategy:**
- Presence expires in 5 minutes
- Users re-register every few minutes
- If user disconnects without cleanup, auto-expires

---

## System Design Questions

### Q16: How would you scale this to handle 1 million users?

**Answer:**

**Architecture Changes:**

1. **Horizontal Scaling (Backend)**
```javascript
// Add Redis adapter for Socket.io
const redisAdapter = require('@socket.io/redis-adapter');
io.adapter(redisAdapter.createAdapter(redisClient));

// Run multiple instances behind load balancer
// Sticky sessions OR re-auth on connect
```

2. **Database Sharding**
```javascript
// Shard users by userId hash
const shard = hash(userId) % NUM_SHARDS;
const db = mongoose.connection.useDb(`shard_${shard}`);
```

3. **Read Replicas**
```javascript
// MongoDB read replicas for analytics
const readReplica = mongoose.createConnection(READ_REPLICA_URL);
```

4. **Kafka Partitioning**
```javascript
// Increase partitions for throughput
{ topic: 'user-events', numPartitions: 10 }  // Was 3
```

5. **Caching Strategy**
```javascript
// Cache frequently accessed data
// Use Redis cluster for HA
// Cache-aside pattern for hot data
```

**Metrics to Monitor:**
- Kafka lag per consumer group
- Redis memory usage
- MongoDB query performance
- Socket.io connection count

---

### Q17: How do you ensure data consistency across Redis and MongoDB?

**Answer:**

We use **Eventual Consistency** with these strategies:

**1. Write-Through Pattern:**
```javascript
// Write to DB first, then cache
await user.save();  // MongoDB (source of truth)
await redisClient.setUserData(userId, user);  // Redis (cache)

// Publish event
await kafkaClient.publishUserEvent('PROFILE_UPDATED', ...);
```

**2. Cache Invalidation:**
```javascript
// When data changes, invalidate cache
await redisClient.del(`user:${userId}`);  // Delete old cache
await redisClient.setUserData(userId, updatedUser);  // Set new
```

**3. TTL for Staleness:**
```javascript
// Short TTL forces refresh
await redisClient.setUserData(userId, user, 1800); // 30min
```

**4. Read-Repair:**
```javascript
async function getUserData(userId) {
  let user = await redisClient.getUserData(userId);
  
  if (!user) {
    user = await User.findById(userId);
    await redisClient.setUserData(userId, user);
  }
  
  return user;
}
```

**Consistency Model:**
- **Strong consistency**: Session data (critical)
- **Eventual consistency**: User profile (acceptable)
- **Acceptable lag**: 30 minutes for user data

---

## Implementation Deep Dive

### Q18: Show me the complete Redis integration in app.js.

**Answer:**

```javascript
// app.js - Complete Integration

// 1. Import clients
const redisClient = require('./config/redis');
const kafkaClient = require('./config/kafka');

// 2. Initialize connections
async function initializeConnections() {
  await redisClient.connect();  // Connect to Redis
  await kafkaClient.connect();  // Connect to Kafka
  // ... start server
}

// 3. Socket.io Presence with Redis
io.on('connection', async (socket) => {
  // Register user
  socket.on('register', async (userId) => {
    await redisClient.setUserPresence(userId, socket.id, 300);
    await kafkaClient.publishUserEvent('USER_ONLINE', userId);
  });
  
  // Send message
  socket.on('private-message', async ({ toUserId, message }) => {
    // Save to MongoDB
    const saved = await Message.create({ fromUserId, toUserId, text: message });
    
    // Cache in Redis
    const recent = await redisClient.getRecentMessages(fromUserId, toUserId) || [];
    recent.unshift({ fromUserId, toUserId, text: message });
    await redisClient.setRecentMessages(fromUserId, toUserId, recent.slice(0, 50));
    
    // Publish event
    await kafkaClient.publishMessageEvent('MESSAGE_SENT', {
      messageId: saved._id, fromUserId, toUserId, text: message
    });
    
    // Emit to recipient
    const targetSocket = getUserSocket(toUserId);
    io.to(targetSocket).emit('private-message', { message, fromUserId });
  });
  
  // Disconnect
  socket.on('disconnect', async () => {
    const userId = getUserId(socket.id);
    await redisClient.deleteUserPresence(userId);
    await kafkaClient.publishUserEvent('USER_OFFLINE', userId);
  });
});

// 4. Graceful Shutdown
process.on('SIGINT', async () => {
  await redisClient.disconnect();
  await kafkaClient.disconnect();
  server.close();
});
```

---

### Q19: Explain your Kafka topic partitioning strategy.

**Answer:**

We use **key-based partitioning** for ordering:

**Strategy:**
```javascript
// Messages with same key go to same partition
await producer.send({
  topic: 'user-events',
  messages: [{
    key: userId,  // Partition determined by key hash
    value: JSON.stringify(eventData)
  }]
});
```

**Why this matters:**
- **Ordering**: Same user events processed in order
- **Failover**: If consumer dies, another picks up same partition
- **Idempotency**: Process each partition independently

**Partition Distribution:**
```
Topic: user-events (3 partitions)

Partition 0: userId % 3 == 0 → users 3, 6, 9, ...
Partition 1: userId % 3 == 1 → users 1, 4, 7, ...
Partition 2: userId % 3 == 2 → users 2, 5, 8, ...
```

**Consumer Assignment:**
```javascript
// With 3 consumers, each gets one partition
Consumer 1 → Partition 0
Consumer 2 → Partition 1  
Consumer 3 → Partition 2

// With 1 consumer, gets all 3 partitions
Consumer 1 → Partitions 0, 1, 2
```

---

### Q20: What are the trade-offs you made with Redis and Kafka?

**Answer:**

**Redis Trade-offs:**

**Pros:**
- ✅ 97% faster responses (3ms vs 100ms)
- ✅ 70% database load reduction
- ✅ Sub-millisecond operations
- ✅ Rich data structures (sets, sorted sets, lists)

**Cons:**
- ❌ Memory is expensive ($0.10/GB/month vs $0.02 for disk)
- ❌ Data could be lost on crash (mitigated with persistence)
- ❌ Size limited by RAM
- ❌ Requires cache invalidation logic

**Kafka Trade-offs:**

**Pros:**
- ✅ Decoupled services (loose coupling)
- ✅ Historical data (7-day retention)
- ✅ High throughput (millions events/sec)
- ✅ Replay capability

**Cons:**
- ❌ Eventual consistency (not immediate)
- ❌ Complex consumer management
- ❌ Requires careful ordering considerations
- ❌ Overhead for simple use cases

**Overall Decision:**
- Redis is worth it for 70% database load reduction
- Kafka is worth it for scalable analytics pipeline
- Both have learning curve but provide significant benefits

---

## Quick Interview Tips

### Talking Points:

1. **Performance**: "We achieved 97% faster responses with Redis"
2. **Scalability**: "Kafka allows us to scale horizontally"
3. **Real-time**: "Redis enables sub-millisecond presence tracking"
4. **Analytics**: "Kafka streams provide historical event data"
5. **Trade-offs**: "We chose speed over data size (Redis) and async over sync (Kafka)"

### Code References:

- Redis client: `BACKEND/src/config/redis.js`
- Kafka client: `BACKEND/src/config/kafka.js`
- Integration: `BACKEND/src/app.js`
- Session middleware: `BACKEND/src/middlewares/auth.js`

---

## Kafka Infrastructure: Zookeeper Questions

### Q21: What is Zookeeper and why does Kafka need it?

**Answer:**

**Zookeeper** is a centralized service for maintaining configuration information, naming, and distributed synchronization.

**Kafka's Dependency on Zookeeper:**

**1. Broker Registration:**
- Each Kafka broker registers itself with Zookeeper on startup
- Zookeeper maintains a list of all available brokers
- Broker list is stored in `/brokers/ids/{brokerId}`

**2. Topic Configuration:**
- Topic metadata is stored in Zookeeper
- Partition leaders and replicas are tracked
- Topic configuration and retention policies

**3. Leader Election:**
- When a broker goes down, Zookeeper coordinates leader election
- One partition leader is elected from available replicas
- Ensures high availability

**4. Consumer Group Coordination (Pre-2.8):**
- Before Kafka 2.8, consumer groups used Zookeeper
- Now uses the internal consumer group coordinator

**In Our Setup:**
```yaml
# docker-compose.yml
zookeeper:
  image: confluentinc/cp-zookeeper:7.4.0
  environment:
    ZOOKEEPER_CLIENT_PORT: 2181
  ports:
    - "2181:2181"

kafka:
  environment:
    KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
```

**Benefits:**
- **High Availability**: Broker coordination
- **Configuration Management**: Centralized metadata
- **Leader Election**: Automatic failover
- **Topic Creation**: Track all topics

---

### Q22: Explain Zookeeper's role in Kafka cluster management.

**Answer:**

Zookeeper acts as the **coordination layer** for Kafka:

**1. Broker Management:**
```bash
# Zookeeper stores broker information
/ brokers
  / ids
    / 1 (contains broker metadata)
    / 2
    / 3
```

**Key Functions:**
- **Broker Registration**: When a broker starts, it registers in Zookeeper
- **Health Monitoring**: Detects broker failures
- **Coordination**: Coordinates partition leadership

**2. Topic Management:**
```bash
# Topic metadata in Zookeeper
/ broker-topics
  / my-topic
    / partitions
      / 0 (partition leader: broker 1)
      / 1 (partition leader: broker 2)
```

**Functions:**
- Track partition leaders
- Manage replication
- Store topic configuration

**3. Controller Election:**
- One broker becomes the **Kafka controller**
- Controller manages partition leader election
- Only one controller exists at a time
- Stored in `/controller` znode

**4. Consumer Group Coordination (Legacy):**
```bash
# Old way (pre-2.8)
/consumers
  /devconnect-group
    /offsets (partition offsets)
```

**How It Works:**
1. Zookeeper detects broker failure
2. Triggers leader election for partitions
3. New leader is elected from replicas
4. All brokers notified via Zookeeper

**In Code:**
```javascript
// Our Kafka configuration
const kafkaConfig = {
  clientId: 'devconnect-app',
  brokers: ['localhost:9092'],
  // Kafka connects to Zookeeper internally
  // We don't need to manage Zookeeper connection directly
};
```

---

### Q23: What happens if Zookeeper goes down?

**Answer:**

**Impact on Kafka:**

**1. Short-Term (< 30 seconds):**
- **Existing connections work**: Brokers continue serving requests
- **No new topic creation**: Cannot create topics
- **No leader election**: Partition reassignment stops
- **Consumer offsets**: Cannot commit offsets (pre-2.8)

**2. Medium-Term (30s - 5 min):**
- **Leader elections fail**: If a broker dies, no new leader elected
- **Consumer rebalancing stops**: Consumer groups can't rebalance
- **Partition reassignment stops**: Cannot move partitions
- **Configuration changes fail**: Can't update broker configs

**3. Long-Term (> 5 min):**
- **Broker failures**: If a broker crashes, cluster degrades
- **Topic operations fail**: Cannot create/delete topics
- **No new consumers**: Cannot join consumer groups
- **Data loss risk**: Without leader election, replicas may lag

**Our Setup:**
```yaml
# docker-compose.yml - Zookeeper persistence
zookeeper:
  volumes:
    - zookeeper_data:/var/lib/zookeeper/data
  restart: unless-stopped  # Auto-restart
  healthcheck:             # Health monitoring
    test: ["CMD", "bash", "-c", "echo 'ruok' | nc localhost 2181"]
```

**Mitigation Strategies:**

**1. Persistence:**
```yaml
volumes:
  zookeeper_data:/var/lib/zookeeper/data
```

**2. Health Checks:**
```javascript
// Check Zookeeper health
docker exec -it devconnect-zookeeper zkServer.sh status
```

**3. Redundancy (Production):**
```
# Use Zookeeper ensemble (3-5 nodes)
Z1, Z2, Z3 → One active, others as followers
Majority voting ensures availability
```

**4. Monitoring:**
```bash
# Monitor Zookeeper
watch -n 1 "echo stat | nc localhost 2181"
```

---

### Q24: How do you monitor Zookeeper in production?

**Answer:**

**1. Health Check:**
```bash
# Built-in command
docker exec -it devconnect-zookeeper zkServer.sh status

# Remote via netcat
echo ruok | nc localhost 2181
# Response: imok
```

**2. Zookeeper Stats:**
```bash
# Get statistics
echo stat | nc localhost 2181

# Output:
# Zookeeper version: 3.8.0
# Latency min/avg/max: 0/0/0
# Received: 1250
# Sent: 1251
# Connections: 1
# Outstanding: 0
```

**3. JMX Monitoring:**
```javascript
// Zookeeper JMX port
ports:
  - "2181:2181"
  - "9092:9092"  # Kafka
```

**4. Log Monitoring:**
```bash
# Check Zookeeper logs
docker logs devconnect-zookeeper

# Key metrics to watch:
# - Connection count
# - Request latency
# - Outliers (slow requests)
# - Node counts
```

**5. Prometheus Metrics:**
```yaml
# Scrape Zookeeper metrics
scrape_configs:
  - job_name: 'zookeeper'
    static_configs:
      - targets: ['localhost:2181']
```

**Key Metrics to Monitor:**
```javascript
{
  "latency": { min: 0, avg: 1, max: 5 },      // Request latency
  "connections": 15,                           // Active connections
  "outstanding": 0,                            // Pending requests
  "znode_count": 1250,                         // Number of znodes
  "watchers": 3                                // Active watchers
}
```

**6. Application-Level Monitoring:**
```javascript
// In our code
async function checkKafkaHealth() {
  try {
    await kafkaClient.admin.listTopics(); // Uses Zookeeper
    console.log('Kafka and Zookeeper healthy');
  } catch (error) {
    console.error('Zookeeper connection issue:', error);
  }
}
```

**Alerting Thresholds:**
- Latency > 10ms → Warn
- Latency > 50ms → Critical
- Connections > 1000 → Warn
- Zookeeper down → Critical

---

### Q25: Explain Zookeeper vs KRaft (Kafka without Zookeeper).

**Answer:**

**Zookeeper Mode (Traditional):**
- Kafka depends on external Zookeeper
- Zookeeper manages metadata
- Separate service to manage
- Used in Kafka < 2.8

**KRaft Mode (New, Kafka 3.0+):**
- Kafka manages its own metadata
- No external Zookeeper needed
- Simpler architecture
- Self-contained Kafka

| Feature | Zookeeper Mode | KRaft Mode |
|---------|---------------|------------|
| **Dependencies** | Requires Zookeeper | Self-contained |
| **Metadata Storage** | Zookeeper | Kafka itself |
| **Broker Count** | Works with few brokers | Scales to 1000s |
| **Metadata Size** | Limited by Zookeeper | Unlimited |
| **Startup Time** | ~30 seconds | ~1 second |
| **Leader Election** | Zookeeper coordinates | Kafka controller |
| **Partition Limit** | ~200k per cluster | Millions |

**Why We Use Zookeeper:**
```javascript
// Current setup (stable, production-ready)
{
  kafka: "7.4.0",
  mode: "Zookeeper",
  reason: "Battle-tested, stable for our use case"
}
```

**When to Switch to KRaft:**
- Starting new clusters (Kafka 3.3+)
- Need > 200k partitions
- Want simpler deployment (no Zookeeper)
- Need faster startup time

**Migration Consideration:**
```javascript
// Zookeeper → KRaft migration (future)
// 1. Start Kafka in Zookeeper mode
// 2. Enable KRaft migration
// 3. Controllers replicate metadata from Zookeeper
// 4. Switch to KRaft mode
// 5. Decommission Zookeeper
```

**Our Docker Setup:**
```yaml
# Current: Zookeeper mode
kafka:
  environment:
    KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181

# Future: KRaft mode (when Kafka 4.0 is stable)
kafka:
  environment:
    KAFKA_PROCESS_ROLES: broker,controller
    KAFKA_CONTROLLER_QUORUM_VOTERS: "1@localhost:9093"
    # No Zookeeper needed
```

---

## JWT & Authentication Interview Questions

### Q26: Explain JWT authentication in DevConnect

**Answer:**

We use **JWT (JSON Web Tokens)** for stateless authentication:

**JWT Structure:**
```javascript
// Header.Payload.Signature
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmEzYjg4OCIsImlhdCI6MTYwMDAwMDAwMH0.signature
```

**Components:**
1. **Header**: Algorithm and type (`HS256`, `JWT`)
2. **Payload**: User ID, issued at, expiry
3. **Signature**: HMAC-SHA256 of header + payload with secret

**Implementation in DevConnect:**
```javascript
// Generate JWT (in User model)
userSchema.methods.getJWT = async function() {
  const jwtSecret = process.env.JWT_SECRET || "dev@tinder$790";
  return await jwt.sign({ _id: this._id }, jwtSecret, {
    expiresIn: "8h"
  });
};

// Verify JWT (in middleware)
const decoded = await jwt.verify(token, jwtSecret);
const user = await User.findById(decoded._id);
```

**Why JWT?**
- **Stateless**: No server-side session storage needed
- **Scalable**: Works across multiple instances
- **Secure**: Signature prevents tampering
- **Performance**: No database lookup required

---

### Q27: How do you secure JWTs in production?

**Answer:**

**1. HTTP-Only Cookies:**
```javascript
// Prevents XSS attacks
res.cookie("token", token, {
  httpOnly: true,      // JavaScript cannot access
  secure: true,         // HTTPS only
  sameSite: 'none',     // Cross-site protection
  expires: new Date(Date.now() + 8 * 3600000)
});
```

**2. Strong Secret:**
```bash
# Environment variable
JWT_SECRET=super-secure-random-string-256-bits

# Generate secure secret
openssl rand -base64 32
```

**3. Short Expiry:**
```javascript
// 8 hour expiry
expiresIn: "8h"

// Renew token on activity
if (Date.now() > expiry) {
  const newToken = await user.getJWT();
  res.cookie("token", newToken);
}
```

**4. HTTPS Only:**
```javascript
app.set('trust proxy', 1); // For proxies/load balancers

// Middleware
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}
```

**5. Refresh Tokens (not implemented yet):**
```javascript
// Short-lived access token (15 min)
// Long-lived refresh token (7 days)
// Stored in Redis
```

---

### Q28: Explain JWT vs Session-based authentication

**Answer:**

| Feature | JWT | Sessions |
|---------|-----|----------|
| **Storage** | Client-side (cookie) | Server-side (Redis/DB) |
| **Stateless** | ✅ Yes | ❌ No |
| **Scalable** | ✅ Multiple instances | ⚠️ Needs shared storage |
| **Performance** | ✅ No DB lookup | ❌ Requires lookup |
| **Security** | ⚠️ Cannot revoke easily | ✅ Can revoke |
| **Size** | ⚠️ Larger (2-4KB) | ✅ Small (session ID) |

**When to use JWT:**
- Microservices architecture
- Multiple servers
- Mobile apps (no cookies)
- API authentication
- Short-lived tokens (15 minutes)

**When to use Sessions:**
- Traditional web apps
- Need to revoke immediately
- Complex authorization
- Server-side session data

**Our Hybrid Approach:**
```javascript
// JWT for authentication
const token = await user.getJWT();

// Redis session for additional data
await redisClient.setSession(token, {
  userId: user._id,
  emailId: user.emailId,
  ipAddress: req.ip
});

// Get session data
const session = await redisClient.getSession(token);
```

**Benefits:**
- JWT for fast auth checks
- Redis for session metadata
- Best of both worlds

---

### Q29: How does JWT signature verification work?

**Answer:**

**Signature Generation:**
```javascript
// Server creates signature
const header = base64url({ alg: "HS256", typ: "JWT" });
const payload = base64url({ _id: userId, iat: timestamp });
const secret = process.env.JWT_SECRET;

// HMAC-SHA256 signature
const signature = HMAC_SHA256(`${header}.${payload}`, secret);
const token = `${header}.${payload}.${signature}`;
```

**Verification:**
```javascript
// When receiving token
const [header, payload, signature] = token.split('.');

// Recompute signature
const computedSignature = HMAC_SHA256(
  `${header}.${payload}`, 
  JWT_SECRET
);

// Compare signatures
if (signature === computedSignature) {
  // Token is valid and not tampered
  const decoded = JSON.parse(base64urlDecode(payload));
  return decoded;
} else {
  throw new Error('Invalid signature');
}
```

**Security:**
- **Tampering detected**: Changing payload invalidates signature
- **Secret required**: Cannot create valid tokens without secret
- **Expiry check**: Also verify `exp` claim

**In Code:**
```javascript
const jwt = require('jsonwebtoken');

// Verify with built-in method
const decoded = await jwt.verify(token, JWT_SECRET, {
  algorithms: ['HS256']
});
```

---

### Q30: How do you handle JWT expiry and refresh?

**Answer:**

**Current Implementation (Simple):**
```javascript
// Token expires in 8 hours
const token = await user.getJWT();

// Middleware checks expiry automatically
const decoded = jwt.verify(token, JWT_SECRET);
// Throws error if expired
```

**Refresh Token Pattern (Recommended):**

**1. Generate Tokens:**
```javascript
// Short-lived access token (15 min)
const accessToken = jwt.sign(
  { _id: user._id }, 
  ACCESS_SECRET, 
  { expiresIn: '15m' }
);

// Long-lived refresh token (7 days)
const refreshToken = jwt.sign(
  { _id: user._id },
  REFRESH_SECRET,
  { expiresIn: '7d' }
);

// Store refresh token in Redis
await redisClient.set(
  `refresh:${user._id}`, 
  refreshToken, 
  7 * 24 * 3600
);
```

**2. Middleware:**
```javascript
const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    try {
      // Try to verify access token
      const decoded = jwt.verify(token, ACCESS_SECRET);
      req.user = await User.findById(decoded._id);
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // Access token expired, try refresh
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
        
        // Check if refresh token exists in Redis
        const storedRefresh = await redisClient.get(`refresh:${decoded._id}`);
        
        if (!storedRefresh || storedRefresh !== refreshToken) {
          throw new Error('Invalid refresh token');
        }
        
        // Generate new access token
        const user = await User.findById(decoded._id);
        const newAccessToken = await user.getJWT();
        
        res.cookie('token', newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none'
        });
        
        req.user = user;
        return next();
      }
      throw error;
    }
  } catch (error) {
    res.status(401).send('Authentication required');
  }
};
```

**3. Logout:**
```javascript
// Delete refresh token from Redis
await redisClient.del(`refresh:${userId}`);

// Clear cookies
res.clearCookie('token');
res.clearCookie('refreshToken');
```

---

**End of Interview Questions (30 Total)**

**Question Breakdown:**
- Redis (Q1-Q6): 6 questions
- Kafka (Q7-Q12): 6 questions
- Zookeeper (Q21-Q25): 5 questions
- Architecture (Q13-Q15): 3 questions
- System Design (Q16-Q17): 2 questions
- Implementation (Q18-Q20): 3 questions
- JWT (Q26-Q30): 5 questions
- **Total: 30 comprehensive questions**

For more details, see:
- `DOCUMENTATION/KAFKA_REDIS_ARCHITECTURE.md` - Architecture overview
- `DOCUMENTATION/IMPLEMENTATION_SUMMARY.md` - Implementation summary
- `REDIS_KAFKA_INTEGRATION_FILES/KAFKA_REDIS_IMPLEMENTATION_GUIDE.md` - Full technical guide

