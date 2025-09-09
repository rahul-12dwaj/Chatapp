const mongoose = require("mongoose");

const deviceInfoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userAgent: { type: String, default: "Unknown" },
  platform: { type: String, default: "Unknown" },
  language: { type: String, default: "Unknown" },
  screenWidth: { type: Number, default: 0 },
  screenHeight: { type: Number, default: 0 },
  viewportWidth: { type: Number, default: 0 },
  viewportHeight: { type: Number, default: 0 },
  ipAddress: { type: String, default: "Unknown" },
  loginTime: {
    type: String,
    default: () => new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  },
});

module.exports = mongoose.model("DeviceInfo", deviceInfoSchema);
