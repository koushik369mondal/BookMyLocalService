const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const { protect } = require("../../middleware/authMiddleware");

router.post("/register/send-otp", authController.sendRegisterOtp);
router.post("/register/verify-otp", authController.verifyRegisterOtp);
router.post("/login/send-otp", authController.sendLoginOtp);
router.post("/login/verify-otp", authController.verifyLoginOtp);
router.post("/google", authController.googleAuth);
router.get("/me", protect, authController.me);

module.exports = router;
