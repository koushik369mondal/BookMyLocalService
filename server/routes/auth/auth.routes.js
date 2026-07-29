const express = require("express");
const router = express.Router();
const { 
    register, 
    login, 
    getMe, 
    updateProfile, 
    sendOtp, 
    verifyOtp, 
    resendOtp,
    registerSendOtp,
    registerVerifyOtp,
    loginSendOtp,
    loginVerifyOtp
} = require("../../controllers/auth");
const { protect } = require("../../middleware/authMiddleware");

// Passwordless OTP Registration Routes
router.post("/register/send-otp", registerSendOtp);
router.post("/register/verify-otp", registerVerifyOtp);

// Passwordless OTP Login Routes
router.post("/login/send-otp", loginSendOtp);
router.post("/login/verify-otp", loginVerifyOtp);

// Generic / Legacy OTP Routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

// Legacy Route Aliases
router.post("/register", register);
router.post("/login", login);

// Authenticated User Profile Routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

module.exports = router;
