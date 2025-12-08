"use strict";
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// app.use(authentication):

const jwt = require("jsonwebtoken");
const Token = require("../models/token");

module.exports = async (req, res, next) => {
  const auth = req.headers?.authorization || null; // "Bearer <accessToken>" veya "Token <simpleToken>"
  const tokenKey = auth ? auth.split(" ") : null;

  if (tokenKey) {
    if (tokenKey[0] === "Token") {
      // SimpleToken kontrolü
      const tokenData = await Token.findOne({ token: tokenKey[1] }).populate("userId");
      req.user = tokenData ? tokenData.userId : undefined;
    } else if (tokenKey[0] === "Bearer") {
      // JWT kontrolü
      try {
        const userData = jwt.verify(tokenKey[1], process.env.JWT_SECRET); // ✅ ACCESS_KEY yerine JWT_SECRET
        req.user = userData;
      } catch (err) {
        return res.status(403).json({ msg: "Invalid or expired token" });
      }
    }
  }

  if (!req.user) {
    return res.status(403).json({ msg: "Authorization required" });
  }

  next();
};
