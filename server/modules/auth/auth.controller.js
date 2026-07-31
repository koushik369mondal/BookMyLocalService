const authService = require("./auth.service");

const googleAuth = async (req, res) => {
    try {
        const result = await authService.googleAuth(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.error("googleAuth controller error:", error);
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
    googleAuth,
    me
};
