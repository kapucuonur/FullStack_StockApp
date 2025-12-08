"use strict"
const router = require("express").Router()
const purchase = require("../controllers/purchase")
const permissions = require("../middlewares/permissions")

// URL: /purchases
// sadece staff + admin erişebilir

router.route("/")
    .get(permissions.isStaff, purchase.list)
    .post(permissions.isStaff, purchase.create)

router.route("/:id")
    .get(permissions.isStaff, purchase.read)
    .put(permissions.isStaff, purchase.update)
    .patch(permissions.isStaff, purchase.update)
    .delete(permissions.isStaff, purchase.delete)

module.exports = router
