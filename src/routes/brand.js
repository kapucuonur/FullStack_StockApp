const express = require("express")
const router = express.Router()
const brandController = require("../controllers/brand")
const { authentication, isAdmin, isAdminOrStaff } = require("../middlewares/auth")

// Everyone can see
router.get("/", authentication, brandController.list)

// Admin can create
router.post("/", authentication, isAdmin, brandController.create)

// Admin or staff can update
router.put("/:id", authentication, isAdminOrStaff, brandController.update)

// Only admin can delete
router.delete("/:id", authentication, isAdmin, brandController.delete)

module.exports = router
