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

// ✅ TEST için: Database'de kullanıcı kontrolü ve oluşturma
const checkAndCreateTestUser = async () => {
  try {
    const User = require("./src/models/user");
    const passwordEncrypt = require("./src/helpers/passwordEncrypt");

    console.log("🔍 Checking for admin user in database...");

    let adminUser = await User.findOne({ username: "admin" });

    if (!adminUser) {
      console.log("👤 Admin user not found. Creating...");

      adminUser = await User.create({
        username: "admin",
        password: "aA?123456", // pre-save middleware encrypt edecek
        email: "admin@site.com",
        firstName: "Admin",
        lastName: "User",
        isActive: true,
        isStaff: true,
        isAdmin: true,
      });

      console.log("✅ Admin user created successfully");
    } else {
      console.log("✅ Admin user already exists");
    }

    // Debug login endpoint
    app.post("/api/v1/debug-login", async (req, res) => {
      try {
        const { username, password } = req.body;

        if (username === "admin" && password === "aA?123456") {
          const user = await User.findOne({ username: "admin" });
          if (user) {
            const Token = require("./src/models/token");
            let tokenData = await Token.findOne({ userId: user._id });

            if (!tokenData) {
              tokenData = await Token.create({
                userId: user._id,
                token: passwordEncrypt(user._id + Date.now()),
              });
            }

            return res.json({
              error: false,
              message: "Debug login successful",
              token: tokenData.token,
              user,
            });
          }
        }
        res.status(401).json({ error: true, message: "Invalid credentials" });
      } catch (error) {
        res.status(500).json({ error: true, message: error.message });
      }
    });

    console.log("✅ Debug login endpoint ready: POST /api/v1/debug-login");
  } catch (error) {
    console.error("❌ Test user setup failed:", error.message);
  }
};

// 2 saniye sonra test user kontrolünü çalıştır
setTimeout(checkAndCreateTestUser, 2000);

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

// ✅ React frontend'i serve et
app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// ✅ Server başlat
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
