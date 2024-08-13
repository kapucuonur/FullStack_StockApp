"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const router = require("express").Router()
const authentication = require("../middlewares/authentication") // ✅ global JWT kontrolü

/* ------------------------------------------------------- */
// routes/:

// URL: /

// Global JWT kontrolü (auth dışındaki tüm route’lar için):
router.use(authentication)

// auth (login/register/refresh/logout → public erişim):
router.use("/auth", require("./auth"))

// user:
router.use("/users", require("./user"))

// token:
router.use("/tokens", require("./token"))

// brand:
router.use("/brands", require("./brand"))

// category:
router.use("/categories", require("./category"))

// firm:
router.use("/firms", require("./firm"))

// product:
router.use("/products", require("./product"))

// purchase:
router.use("/purchases", require("./purchase"))

// sale:
router.use("/sales", require("./sale"))

// document:
router.use("/documents", require("./document"))

/* ------------------------------------------------------- */
module.exports = router
