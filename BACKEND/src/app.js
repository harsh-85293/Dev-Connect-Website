require('dotenv').config(); // Load environment variables
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const Message = require("./models/message");
const connectdb = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser")
const cors = require("cors")

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}))
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

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  }
});

const userIdToSocketId = new Map();
const socketIdToUserId = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", (userId) => {
    userIdToSocketId.set(userId, socket.id);
    socketIdToUserId.set(socket.id, userId);
    // broadcast presence
    io.emit("presence", { userId, online: true });
  });

  socket.on("private-message", async ({ toUserId, message, fromUserId }) => {
    const ts = Date.now();
    try {
      await Message.create({ fromUserId, toUserId, text: message, ts });
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
  socket.on("presence:query", ({ userId }) => {
    const online = userIdToSocketId.has(userId);
    socket.emit("presence:state", { userId, online });
  });

  socket.on("disconnect", () => {
    const userId = socketIdToUserId.get(socket.id);
    if (userId) {
      userIdToSocketId.delete(userId);
      socketIdToUserId.delete(socket.id);
      io.emit("presence", { userId, online: false });
    }
    console.log("Socket disconnected:", socket.id);
  });
});

connectdb()
  .then(async () => {
    console.log("Database connection successful");

    try {
      await User.init(); // ensure unique indexes
      server.listen(process.env.PORT || 3000, () =>
        console.log(`Server is successfully running on port ${process.env.PORT || 3000}`)
      );
    } catch (err) {
      console.error("Error initializing User model:", err.message);
      process.exit(1); // stop server if init fails
    }
  })
  .catch((err) => {
    console.error("Database cannot be connected:", err.message);
  });
