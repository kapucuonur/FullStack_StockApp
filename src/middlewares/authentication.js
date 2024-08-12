"use strict";
const jwt = require("jsonwebtoken");
const Token = require("../models/token");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  const auth = req.headers?.authorization || null;
  const tokenKey = auth ? auth.split(" ") : null;

  if (tokenKey) {
    if (tokenKey[0] === "Token") {
      // SimpleToken kontrolü
      const tokenData = await Token.findOne({ token: tokenKey[1] }).populate("userId");
      req.user = tokenData ? tokenData.userId : undefined;
    } else if (tokenKey[0] === "Bearer") {
      // JWT kontrolü
      try {
        const decoded = jwt.verify(tokenKey[1], process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || !user.isActive) {
          return res.status(403).json({ error: true, message: "User not found or inactive" });
        }
        req.user = user;
      } catch (err) {
        return res.status(403).json({ error: true, message: "Invalid or expired token" });
      }
    }
  }

  if (!req.user) {
    return res.status(403).json({ error: true, message: "Authorization required" });
  }

  next();
};
