"use strict"
const router = require("express").Router()
const category = require("../controllers/category")
const permissions = require("../middlewares/permissions")

// URL: /categories

router.route("/")
    .get(category.list)
    .post(permissions.isStaff, category.create)

router.route("/:id")
    .get(category.read)
    .put(permissions.isStaff, category.update)
    .patch(permissions.isStaff, category.update)
    .delete(permissions.isAdmin, category.delete)

module.exports = router
