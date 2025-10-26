require('dotenv').config(); // Load environment variables
const express = require("express");
const http = require("http");
const app = express();
// behind Render/Proxy for secure cookies
app.set('trust proxy', 1);
const server = http.createServer(app);
const { Server } = require("socket.io");
const Message = require("./models/message");
const connectdb = require("./config/database");
const redisClient = require("./config/redis");
const kafkaClient = require("./config/kafka");
const User = require("./models/user");
const cookieParser = require("cookie-parser")
const cors = require("cors")

const staticAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

// Allow Vercel preview deployments for this project
const vercelPreviewRegex = /^https:\/\/dev-connect-website(-[a-z0-9-]+)?\.vercel\.app$/;
// Also allow any *.vercel.app (fallback) and localhost for DX
const anyVercelRegex = /^https?:\/\/[a-z0-9-]+\.vercel\.app$/;

const isOriginAllowed = (origin) =>
  staticAllowedOrigins.includes(origin) ||
  vercelPreviewRegex.test(origin) ||
  anyVercelRegex.test(origin);

// Manual CORS to avoid any '*' headers from defaults
app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  if (requestOrigin) {
    // Set the origin back; browser enforces credentials + exact origin
    res.header("Access-Control-Allow-Origin", requestOrigin);
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PATCH,PUT,DELETE,OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Accept"
    );
    if (req.method === "OPTIONS") return res.sendStatus(204);
  }
  return next();
});
app.use(express.json());
app.use(cookieParser())

// Health check for hosting providers
app.get("/healthz", (req, res) => {
  res.status(200).send("ok");
});

const authRouter = require("./routes/auth")
const userRouter = require("./routes/user")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const emailPreferencesRouter = require("./routes/emailPreferences")
const paymentsPhonePeRouter = require("./routes/paymentsPhonePe")

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", emailPreferencesRouter);
app.use("/", paymentsPhonePeRouter);

// Socket.io setup with Redis adapter for scalability
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const ok = isOriginAllowed(origin);
      return callback(ok ? null : new Error("Not allowed by CORS"), ok);
    },
    credentials: true,
  }
});

// Use Redis adapter for Socket.io scaling (optional - only if running multiple instances)
// const { createAdapter } = require('socket.io-redis');
// const redisAdapter = createAdapter({
//   host: process.env.REDIS_HOST || 'localhost',
//   port: process.env.REDIS_PORT || 6379,
//   password: process.env.REDIS_PASSWORD || undefined
// });
// io.adapter(redisAdapter);

const userIdToSocketId = new Map();
const socketIdToUserId = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", async (userId) => {
    userIdToSocketId.set(userId, socket.id);
    socketIdToUserId.set(socket.id, userId);
    
    // Store presence in Redis
    await redisClient.setUserPresence(userId, socket.id);
    
    // Publish user online event to Kafka
    await kafkaClient.publishUserEvent('USER_ONLINE', userId, { socketId: socket.id });
    
    // broadcast presence
    io.emit("presence", { userId, online: true });
  });

  socket.on("private-message", async ({ toUserId, message, fromUserId }) => {
    const ts = Date.now();
    try {
      // Save message to database
      const savedMessage = await Message.create({ fromUserId, toUserId, text: message, ts });
      
      // Cache recent messages in Redis
      const recentMessages = await redisClient.getRecentMessages(fromUserId, toUserId) || [];
      recentMessages.unshift({
        fromUserId,
        toUserId,
        text: message,
        ts: new Date(ts)
      });
      await redisClient.setRecentMessages(fromUserId, toUserId, recentMessages.slice(0, 50)); // Keep last 50 messages
      
      // Publish message event to Kafka
      await kafkaClient.publishMessageEvent('MESSAGE_SENT', {
        messageId: savedMessage._id,
        fromUserId,
        toUserId,
        text: message,
        ts
      });
      
    } catch (e) {
      console.error("Failed to save message:", e.message);
    }
    
    const targetSocket = userIdToSocketId.get(toUserId);
    io.to(socket.id).emit("private-message", { message, fromUserId, ts });
    if (targetSocket) {
      io.to(targetSocket).emit("private-message", { message, fromUserId, ts });
    }
  });

  // presence query for a specific user id
  socket.on("presence:query", async ({ userId }) => {
    // Check Redis first, then fallback to in-memory map
    const redisPresence = await redisClient.getUserPresence(userId);
    const online = redisPresence || userIdToSocketId.has(userId);
    socket.emit("presence:state", { userId, online });
  });

  socket.on("disconnect", async () => {
    const userId = socketIdToUserId.get(socket.id);
    if (userId) {
      userIdToSocketId.delete(userId);
      socketIdToUserId.delete(socket.id);
      
      // Remove presence from Redis
      await redisClient.deleteUserPresence(userId);
      
      // Publish user offline event to Kafka
      await kafkaClient.publishUserEvent('USER_OFFLINE', userId, { socketId: socket.id });
      
      io.emit("presence", { userId, online: false });
    }
    console.log("Socket disconnected:", socket.id);
  });
});

// Initialize all connections
async function initializeConnections() {
  try {
    // Connect to MongoDB
    await connectdb();
    console.log("Database connection successful");

    // Connect to Redis
    await redisClient.connect();
    console.log("Redis connection successful");

    // Connect to Kafka
    await kafkaClient.connect();
    console.log("Kafka connection successful");

    // Initialize User model
    await User.init(); // ensure unique indexes

    // Start Kafka consumers
    await startKafkaConsumers();

    // Start server
    server.listen(process.env.PORT || 3000, () =>
      console.log(`Server is successfully running on port ${process.env.PORT || 3000}`)
    );

  } catch (err) {
    console.error("Error initializing connections:", err.message);
    process.exit(1);
  }
}

// Start Kafka consumers for event processing
async function startKafkaConsumers() {
  try {
    // User events consumer
    await kafkaClient.subscribeToUserEvents(async (eventData) => {
      console.log('Processing user event:', eventData.eventType);
      
      switch (eventData.eventType) {
        case 'USER_ONLINE':
          // Update user activity in Redis
          await redisClient.set(`user:${eventData.userId}:last_seen`, new Date().toISOString(), 86400);
          break;
        case 'USER_OFFLINE':
          // Clean up user presence data
          await redisClient.del(`user:${eventData.userId}:last_seen`);
          break;
        case 'USER_SIGNUP':
          // Trigger welcome email or other onboarding processes
          console.log('New user signup:', eventData.userId);
          break;
        case 'USER_LOGIN':
          // Update login analytics
          await redisClient.set(`user:${eventData.userId}:last_login`, new Date().toISOString(), 86400);
          break;
      }
    });

    // Message events consumer
    await kafkaClient.subscribeToMessageEvents(async (eventData) => {
      console.log('Processing message event:', eventData.eventType);
      
      if (eventData.eventType === 'MESSAGE_SENT') {
        // Update message analytics
        await kafkaClient.publishAnalyticsEvent('MESSAGE_ANALYTICS', {
          userId: eventData.data.fromUserId,
          messageCount: 1,
          timestamp: eventData.timestamp
        });
      }
    });

    // Connection events consumer
    await kafkaClient.subscribeToConnectionEvents(async (eventData) => {
      console.log('Processing connection event:', eventData.eventType);
      
      if (eventData.eventType === 'CONNECTION_REQUEST') {
        // Send notification to target user
        await kafkaClient.publishNotificationEvent('CONNECTION_REQUEST_NOTIFICATION', {
          userId: eventData.data.toUserId,
          fromUserId: eventData.data.fromUserId,
          message: 'You have a new connection request!'
        });
      }
    });

    console.log('Kafka consumers started successfully');
  } catch (error) {
    console.error('Error starting Kafka consumers:', error);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  
  try {
    await redisClient.disconnect();
    await kafkaClient.disconnect();
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the application
initializeConnections();
