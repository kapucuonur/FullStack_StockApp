"use strict";
require("express-async-errors");
require("dotenv").config();

const PORT = process.env.PORT || 10000;
const express = require("express");
const path = require("path");
const punycode = require("punycode"); // npm package

const app = express();

// Middleware
app.use(express.json());

// DB bağlantısı
const { dbConnection, mongoose } = require("./src/configs/dbConnection");
dbConnection();

/* -------------------------------------------------------
   ROUTES
------------------------------------------------------- */

// Auth routes
const authRouter = require("./src/routes/auth");
app.use("/api/v1/auth", authRouter);

// ✅ Debug endpoints
app.get("/api/v1/debug/db-status", async (req, res) => {
  try {
    const User = require("./src/models/user");
    const userCount = await User.countDocuments();

    res.json({
      error: false,
      message: "Database status",
      dbConnected: mongoose.connection.readyState === 1,
      userCount,
      adminExists: await User.exists({ username: "admin" }),
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

app.get("/api/v1/debug/test", (req, res) => {
  res.json({
    error: false,
    message: "Debug test endpoint working",
    timestamp: new Date(),
    nodeEnv: process.env.NODE_ENV,
    port: PORT,
  });
});

/* -------------------------------------------------------
   FRONTEND SERVE
------------------------------------------------------- */
app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

/* -------------------------------------------------------
   SERVER START
------------------------------------------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
