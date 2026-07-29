const authService = require("../../services/auth.service");
const { handleMailOrServerError } = require("../../utils/response.util");

/**
 * @desc    Send registration OTP to user email
 * @route   POST /api/auth/register/send-otp
 * @access  Public
 */
const registerSendOtp = async (req, res) => {
    try {
        const result = await authService.sendRegisterOtp({
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            role: req.body.role
        });
        return res.status(200).json(result);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        return handleMailOrServerError(res, error, "registerSendOtp");
    }
};

/**
 * @desc    Verify registration OTP and activate user account
 * @route   POST /api/auth/register/verify-otp
 * @access  Public
 */
const registerVerifyOtp = async (req, res) => {
    try {
        const result = await authService.verifyRegisterOtp({
            email: req.body.email,
            otp: req.body.otp
        });
        return res.status(200).json(result);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        console.error("registerVerifyOtp error:", error);
        return res.status(500).json({ success: false, message: "Server error verifying OTP", error: error.message });
    }
};

/**
 * @desc    Fallback register controller handler
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
    const { otp } = req.body;
    if (otp) {
        return registerVerifyOtp(req, res);
    }
    return registerSendOtp(req, res);
};

module.exports = {
    registerSendOtp,
    registerVerifyOtp,
    register
};
