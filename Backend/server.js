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



const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://chatapp-tau-topaz.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));




// Base route
app.get("/", (req, res) => {
  res.send("<h1>Hello, Geeks!</h1><p>Express server is running.</p>");
});

// API routes
app.use("/api/auth", authRoutes);

// ----- SOCKET.IO SETUP -----
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",                   // for local dev
      "https://chatapp-tau-topaz.vercel.app"    // deployed frontend
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
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

  // Authenticate
  const { token } = socket.handshake.auth;
  const user = verifyToken(token);
  if (!user) return socket.disconnect();
  socket.user = user;

  // Send chat history
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).lean();
    socket.emit("chat history", messages);
  } catch (err) {
    console.error(err);
  }

  // Listen for new messages
  socket.on("chat message", async (msg) => {
    if (!msg.content) return;
    const newMsg = new Message({
      message_id: msg.id, // frontend id
      sender: socket.user.id,
      senderName: socket.user.name || "Anonymous",
      content: msg.content,
      timestamp: msg.timestamp || new Date(),
    });

    await newMsg.save();

    io.emit("chat message", {
      id: newMsg._id.toString(),
      message_id: newMsg.message_id,
      sender: newMsg.sender,
      senderName: newMsg.senderName,
      content: newMsg.content,
      timestamp: newMsg.timestamp,
      seen: false,
    });
  });

  // Typing indicator
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
