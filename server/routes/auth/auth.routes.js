const express = require("express");
const router = express.Router();
const { 
    register, 
    login, 
    getMe, 
    updateProfile, 
    changePassword, 
    sendOtp, 
    verifyOtp, 
    resendOtp,
    registerSendOtp,
    registerVerifyOtp,
    loginSendOtp,
    loginVerifyOtp
} = require("../../controllers/auth/auth.controller");
const { protect } = require("../../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

// Passwordless OTP routes
router.post("/register/send-otp", registerSendOtp);
router.post("/register/verify-otp", registerVerifyOtp);
router.post("/login/send-otp", loginSendOtp);
router.post("/login/verify-otp", loginVerifyOtp);

router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);

module.exports = router;
