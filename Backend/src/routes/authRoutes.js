// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");
const {
  register,
  login,
  logout,
  getMe,
} = require("../controllers/authController");

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);

module.exports = router;
