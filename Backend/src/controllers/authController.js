// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();
const DeviceInfo = require("../models/DeviceInfo");

// ===== Helper: Generate JWT =====
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.profilePic || "https://i.pravatar.cc/150?img=1",
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

// ===== Register User =====
exports.register = async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const { password: pwd, ...userData } = savedUser._doc;

    res.status(201).json({ message: "User registered successfully", user: userData });
    console.log("Register successful!");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===== Login User =====

exports.login = async (req, res) => {
  const { email, password, deviceInfo } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    // Store device info in a standard format
    const newDevice = new DeviceInfo({
      user: user._id,
      userAgent: deviceInfo.userAgent || "Unknown",
      platform: deviceInfo.platform || "Unknown",
      language: deviceInfo.language || "Unknown",
      screenWidth: deviceInfo.screen?.width || 0,
      screenHeight: deviceInfo.screen?.height || 0,
      viewportWidth: deviceInfo.viewport?.width || 0,
      viewportHeight: deviceInfo.viewport?.height || 0,
      ipAddress: req.ip || "Unknown",
    });

    await newDevice.save();

    // Send token in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Return user + token
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id.toString(),
        username: user.username,
        name: user.name,
        avatar: user.profilePic || "https://i.pravatar.cc/150?img=1",
        email: user.email,
        token,
      },
    });

    console.log("Login successful");

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ===== Logout User =====
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
  console.log("Logged out successfully");
};

// ===== Get Current User =====
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
