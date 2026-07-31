const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const { protect } = require("../../middleware/authMiddleware");

router.post("/google", authController.googleAuth);
router.get("/me", protect, authController.me);

module.exports = router;
