"use strict";
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = {
  authenticate: async (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) return res.status(401).json({ error: true, message: "Authorization header missing" });

      const token = authHeader.split(" ")[1];
      if (!token) return res.status(401).json({ error: true, message: "Token missing" });

      const decoded = jwt.verify(token, process.env.ACCESS_KEY);
      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) return res.status(403).json({ error: true, message: "User not found or inactive" });

      req.user = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        isStaff: user.isStaff,
      };

      next();
    } catch (err) {
      return res.status(403).json({ error: true, message: "Invalid or expired token" });
    }
  },

  isAdmin: (req, res, next) => {
    if (req.user?.isAdmin) return next();
    return res.status(403).json({ error: true, message: "Admin role required" });
  },

  isStaff: (req, res, next) => {
    if (req.user?.isStaff) return next();
    return res.status(403).json({ error: true, message: "Staff role required" });
  }
};
