"use strict"
const router = require("express").Router()
const brand = require("../controllers/brand")
const permissions = require("../middlewares/permissions")

// URL: /brands

router.route("/")
    .get(brand.list)                       // herkes görebilir
    .post(permissions.isStaff, brand.create) // staff + admin ekleyebilir

router.route("/:id")
    .get(brand.read)                       // herkes görebilir
    .put(permissions.isStaff, brand.update) // staff + admin güncelleyebilir
    .patch(permissions.isStaff, brand.update)
    .delete(permissions.isAdmin, brand.delete) // sadece admin silebilir

module.exports = router
