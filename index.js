"use strict";
require("express-async-errors");
require("dotenv").config();

const PORT = process.env.PORT || 10000;
const express = require("express");
const path = require("path");

const app = express();

// DB bağlantısı
const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();

// Middleware
app.use(express.json());
app.use(require("./src/middlewares/logger"));
app.use(require("./src/middlewares/findSearchSortPage"));

/* -------------------------------------------------------
   ROUTES
------------------------------------------------------- */

// Ana karşılama
app.all("/api/v1", (req, res) => {
  res.send({
    error: false,
    message: "Welcome to Stock Management API",
    documents: {
      swagger: "/api/v1/documents/swagger",
      redoc: "/api/v1/documents/redoc",
      json: "/api/v1/documents/json",
    },
    user: req.user,
  });
});

// Auth routes (public)
app.use("/api/v1/auth", require("./src/routes/auth"));

// Protected routes (hepsi routes/index.js içinde tanımlı)
const authentication = require("./src/middlewares/authentication");
app.use("/api/v1", authentication, require("./src/routes"));

/* -------------------------------------------------------
   FRONTEND SERVE
------------------------------------------------------- */
app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

/* -------------------------------------------------------
   ERROR HANDLER
------------------------------------------------------- */
app.use("*", (req, res) => {
  res.status(404).json({ msg: "Not Found" });
});
app.use(require("./src/middlewares/errorHandler"));

/* -------------------------------------------------------
   SERVER START
------------------------------------------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}...`);
});
