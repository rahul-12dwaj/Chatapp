const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");
const { sendMessage } = require("../controllers/messageController");

// Send a message (authenticated user)
router.post("/send", authMiddleware, sendMessage);

// Get all messages of a conversation
router.post("/getmessages/:conversationId", authMiddleware);

module.exports = router;
