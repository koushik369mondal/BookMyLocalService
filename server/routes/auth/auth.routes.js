const express = require("express");
const router = express.Router();
const { register, login, getMe, updateProfile, changePassword, sendOtp, verifyOtp, resendOtp } = require("../../controllers/auth/auth.controller");
const { protect } = require("../../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);

module.exports = router;
