const authService = require("./auth.service");

const sendRegisterOtp = async (req, res) => {
    try {
        const result = await authService.sendRegisterOtp(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

const verifyRegisterOtp = async (req, res) => {
    try {
        const result = await authService.verifyRegisterOtp(req.body);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

const sendLoginOtp = async (req, res) => {
    try {
        const result = await authService.sendLoginOtp(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

const verifyLoginOtp = async (req, res) => {
    try {
        const result = await authService.verifyLoginOtp(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

const me = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }
        const user = await authService.getUserProfile(req.user.id);
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

module.exports = {
    sendRegisterOtp,
    verifyRegisterOtp,
    sendLoginOtp,
    verifyLoginOtp,
    me
};
