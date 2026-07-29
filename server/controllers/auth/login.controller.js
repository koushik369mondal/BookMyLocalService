const authService = require("../../services/auth.service");
const { handleMailOrServerError } = require("../../utils/response.util");

/**
 * @desc    Send login OTP to user email
 * @route   POST /api/auth/login/send-otp
 * @access  Public
 */
const loginSendOtp = async (req, res) => {
    try {
        const email = req.body.email || req.body.identifier;
        const result = await authService.sendLoginOtp({ email });
        return res.status(200).json(result);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        return handleMailOrServerError(res, error, "loginSendOtp");
    }
};

/**
 * @desc    Verify login OTP and generate session token
 * @route   POST /api/auth/login/verify-otp
 * @access  Public
 */
const loginVerifyOtp = async (req, res) => {
    try {
        const email = req.body.email || req.body.identifier;
        const otp = req.body.otp || req.body.code || req.body.otpCode;
        const result = await authService.verifyLoginOtp({ email, otp });
        return res.status(200).json(result);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        console.error("loginVerifyOtp error:", error);
        return res.status(500).json({ success: false, message: error.message || "Server error verifying OTP" });
    }
};

/**
 * @desc    Fallback login controller handler
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    const { email, identifier, otp, code } = req.body;
    const targetEmail = email || identifier;
    const targetOtp = otp || code;

    if (targetOtp) {
        req.body.email = targetEmail;
        req.body.otp = targetOtp;
        return loginVerifyOtp(req, res);
    }

    req.body.email = targetEmail;
    return loginSendOtp(req, res);
};

module.exports = {
    loginSendOtp,
    loginVerifyOtp,
    login
};
