"use strict"
const router = require("express").Router()
const firm = require("../controllers/firm")
const permissions = require("../middlewares/permissions")

// URL: /firms

router.route("/")
    .get(firm.list)
    .post(permissions.isStaff, firm.create)

router.route("/:id")
    .get(firm.read)
    .put(permissions.isStaff, firm.update)
    .patch(permissions.isStaff, firm.update)
    .delete(permissions.isAdmin, firm.delete)

module.exports = router
