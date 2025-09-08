const crypto = require("crypto");
const Message = require("../models/Message");
const User = require("../models/User"); // assuming you have a User model
const mongoose = require("mongoose");

// Send a message to all users
const sendMessage = async (req, res, io) => {
  try {
    const senderId = req.user.id; // from auth middleware
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Message content is required" });
    }

    // Get all users except sender
    const allUsers = await User.find({ _id: { $ne: senderId } });

    // Save message for each user and emit
    for (const user of allUsers) {
      const newMessage = new Message({
        message_id: crypto.randomUUID(),
        sender_id: new mongoose.Types.ObjectId(senderId),
        receiver_id: new mongoose.Types.ObjectId(user._id), // store per user
        content,
      });

      await newMessage.save();

      // Emit to online user if connected
      const receiverSocket = io.onlineUsers[user._id.toString()];
      if (receiverSocket) {
        io.to(receiverSocket).emit("chat message", {
          sender: senderId,
          text: content,
          receiver: user._id.toString(),
        });
      }
    }

    res.status(201).json({ message: "Message sent to all users successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = { sendMessage, getMessagesByUser };
