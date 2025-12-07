"use strict";
const User = require("../models/user");
const Token = require("../models/token");
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

      res.status(201).json({ error: false, user });
    } catch (err) {
      res.status(500).json({ error: true, message: err.message });
    }
  },

  // LOGIN
  login: async (req, res) => {
    const { username, email, password } = req.body;

    if ((username || email) && password) {
      const user = await User.findOne({ $or: [{ email }, { username }] });

      if (user && await bcrypt.compare(password, user.password)) {
        if (user.isActive) {
          let tokenData = await Token.findOne({ userId: user._id });
          if (!tokenData) {
            tokenData = await Token.create({
              userId: user._id,
              token: bcrypt.hashSync(user._id + Date.now(), 10),
            });
          }

          const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_KEY, { expiresIn: "30m" });
          const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_KEY, { expiresIn: "3d" });

          return res.status(200).send({
            error: false,
            token: tokenData.token,
            bearer: { accessToken, refreshToken },
            user,
          });
        } else {
          return res.status(401).send({ error: true, message: "This account is not active." });
        }
      } else {
        return res.status(401).send({ error: true, message: "Wrong username/email or password." });
      }
    } else {
      return res.status(401).send({ error: true, message: "Please enter username/email and password." });
    }
  },

  // REFRESH
  refresh: async (req, res) => {
    const refreshToken = req.body?.bearer?.refreshToken;

    if (refreshToken) {
      jwt.verify(refreshToken, process.env.REFRESH_KEY, async (err, decoded) => {
        if (err) return res.status(401).send({ error: true, message: "Invalid refresh token." });

        const user = await User.findById(decoded.id);
        if (user && user.isActive) {
          const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_KEY, { expiresIn: "30m" });
          return res.send({ error: false, bearer: { accessToken } });
        } else {
          return res.status(401).send({ error: true, message: "User not found or inactive." });
        }
      });
    } else {
      return res.status(401).send({ error: true, message: "Please provide refreshToken." });
    }
  },

  // LOGOUT
  logout: async (req, res) => {
    const auth = req.headers?.authorization || null;
    const tokenKey = auth ? auth.split(" ") : null;

    let message = null, result = {};

    if (tokenKey) {
      if (tokenKey[0] === "Token") {
        result = await Token.deleteOne({ token: tokenKey[1] });
        message = "Token deleted. Logout was OK.";
      } else {
        message = "No need any process for logout. You must delete JWT tokens on client side.";
      }
    }

    res.send({ error: false, message, result });
  },
};
