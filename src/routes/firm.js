const express = require("express")
const router = express.Router()
const firmController = require("../controllers/firm")
const { authentication, isAdmin, isAdminOrStaff } = require("../middlewares/auth")

router.get("/", authentication, firmController.list)
router.post("/", authentication, isAdmin, firmController.create)
router.put("/:id", authentication, isAdminOrStaff, firmController.update)
router.delete("/:id", authentication, isAdmin, firmController.delete)

module.exports = router
