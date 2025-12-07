"use strict";
require("express-async-errors");
const PORT = 10000;
require("dotenv").config();
const express = require("express");
const path = require("node:path");
const punycode = require('punycode'); // npm package

const app = express();

const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();


app.use(express.json());

// Serve static files from the "public" folder.
app.use(express.static(path.resolve(__dirname, "./public")));

app.use("/upload", express.static("./upload"));

app.use(require("./src/middlewares/authentication"));

app.use(require("./src/middlewares/logger"));

app.use(require("./src/middlewares/findSearchSortPage"));

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

app.use("/api/v1", require("./src/routes"));
app.get("/", (req, res) => {
  
  /*
  #swagger.ignore = true
  */
  res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});

app.use("*", (req, res) => {
  res.status(404).json({ msg: "Not Found" });
});

app.use(require("./src/middlewares/errorHandler"));

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}...`);
});

 //require('./src/helpers/sync')() // !!! It clear database.
