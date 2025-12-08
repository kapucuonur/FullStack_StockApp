const express = require("express")
const router = express.Router()
const saleController = require("../controllers/sale")
const { authentication, isAdminOrStaff } = require("../middlewares/auth")

// Listeleme → sadece admin ve staff
router.get("/", authentication, isAdminOrStaff, saleController.list)

// Ekleme → sadece admin ve staff
router.post("/", authentication, isAdminOrStaff, saleController.create)

// Güncelleme → sadece admin ve staff
router.put("/:id", authentication, isAdminOrStaff, saleController.update)

// Silme → sadece admin ve staff
router.delete("/:id", authentication, isAdminOrStaff, saleController.delete)

module.exports = router
