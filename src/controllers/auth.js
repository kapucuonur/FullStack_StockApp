"use strict";
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  // REGISTER
  register: async (req, res) => {
    try {
      const { username, firstName, lastName, email, password } = req.body;

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ error: true, message: "Email already exists" });
      }

      const user = await User.create({
        username,
        firstName,
        lastName,
        email,
        password,   // ✅ plain password, model hashliyor
        isActive: true,
      });

      return res.status(201).json({ error: false, user });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  },

  // LOGIN
login: async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!(username || email) || !password) {
      return res.status(400).json({ error: true, message: "Please enter username/email and password." });
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
      return res.status(401).json({ error: true, message: "User not found." });
    }

    // ✅ Model methodunu kullan
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: true, message: "Wrong username/email or password." });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: true, message: "This account is not active." });
    }

    // ✅ JWT üret (rol bilgilerini ekledik)
    const accessToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        isActive: user.isActive,
        isStaff: user.isStaff,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    return res.status(200).json({
      error: false,
      bearer: { accessToken, refreshToken },
      user,
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: "Login failed" });
  }
},


  // REFRESH
  refresh: async (req, res) => {
    const refreshToken = req.body?.bearer?.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ error: true, message: "Please provide refreshToken." });
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(401).json({ error: true, message: "Invalid refresh token." });

      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) {
        return res.status(401).json({ error: true, message: "User not found or inactive." });
      }

      const accessToken = jwt.sign(
        {
          id: user._id,
          username: user.username,
          email: user.email,
          isActive: user.isActive,
          isStaff: user.isStaff,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
      );

      return res.json({ error: false, bearer: { accessToken } });
    });
  },

  // LOGOUT
  logout: async (req, res) => {
    // JWT client-side silinir, backend tarafında işlem yok
    return res.json({
      error: false,
      message: "Logout successful. Please remove JWT tokens on client side.",
    });
  },
};
