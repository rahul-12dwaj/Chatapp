const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message_id: {
    type: String,
    required: true,
    unique: true,
  },
  sender: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Optional: Add index for faster queries
messageSchema.index({ message_id: 1 }, { unique: true });

module.exports = mongoose.model("Message", messageSchema);
