const userRepository = require("../../repositories/user.repository");
const { loginSendOtp, loginVerifyOtp } = require("./login.controller");
const { registerVerifyOtp } = require("./register.controller");

/**
 * @desc    Send OTP to user email (generic endpoint)
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
const sendOtp = async (req, res) => {
    return loginSendOtp(req, res);
};

/**
 * @desc    Verify OTP code (generic endpoint)
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
const verifyOtp = async (req, res) => {
    const email = req.body.email || req.body.identifier;
    if (email) {
        const user = await userRepository.findByEmail(email);
        if (user && !user.isVerified) {
            return registerVerifyOtp(req, res);
        }
    }
    return loginVerifyOtp(req, res);
};

/**
 * @desc    Resend OTP to user email
 * @route   POST /api/auth/resend-otp
 * @access  Public
 */
const resendOtp = async (req, res) => {
    return loginSendOtp(req, res);
};

module.exports = {
    sendOtp,
    verifyOtp,
    resendOtp
};
