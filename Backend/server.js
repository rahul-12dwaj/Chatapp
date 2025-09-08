const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const connectDB = require("./src/config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Models
const Message = require("./src/models/Message");

// Routes
const authRoutes = require("./src/routes/authRoutes");

// Connect to DB
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Base route
app.get("/", (req, res) => {
  res.send("<h1>Hello, Geeks!</h1><p>Express server is running.</p>");
});

// API routes
app.use("/api/auth", authRoutes);

// ----- SOCKET.IO SETUP -----
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// Helper function: verify JWT
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return null;
  }
};

io.on("connection", async (socket) => {
  console.log("New client connected:", socket.id);

  // Authenticate user
  const { token } = socket.handshake.auth;
  const user = verifyToken(token);

  if (!user) {
    console.log("Unauthorized socket connection. Disconnecting...");
    socket.disconnect();
    return;
  }

  socket.user = user;

  // Send existing chat history from DB
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).lean();
    socket.emit("chat history", messages);
  } catch (err) {
    console.error("Error fetching chat history:", err);
  }

  // Listen for new messages
  socket.on("chat message", async (msg) => {
  try {
    if (!msg.content) return;

    const newMsg = new Message({
      message_id: msg.id,   // ✅ map frontend id -> message_id
      sender: socket.user.id,
      senderName: socket.user.name || "Anonymous",
      content: msg.content,
      timestamp: msg.timestamp || new Date(),
    });

    await newMsg.save();

    // 🔥 Emit plain object instead of Mongoose doc
    io.emit("chat message", {
      id: newMsg._id.toString(), // always emit as id
      message_id: newMsg.message_id,
      sender: newMsg.sender,
      senderName: newMsg.senderName,
      content: newMsg.content,
      timestamp: newMsg.timestamp,
    });

  } catch (err) {
    console.error("Error saving chat message:", err);
  }
});



  // Typing indicator
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data); // send to others only
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
