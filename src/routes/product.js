"use strict"
const router = require("express").Router()
const product = require("../controllers/product")
const permissions = require("../middlewares/permissions")

// URL: /products

router.route("/")
    .get(product.list)
    .post(permissions.isStaff, product.create)

router.route("/:id")
    .get(product.read)
    .put(permissions.isStaff, product.update)
    .patch(permissions.isStaff, product.update)
    .delete(permissions.isAdmin, product.delete)

module.exports = router
