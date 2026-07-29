const adminService = require("../services/admin.service");

const getUsers = async (req, res) => {
    try {
        const users = await adminService.getAllUsers(req.query);
        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (err) {
        console.error("Get users controller error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch users."
        });
    }
};

const getProviders = async (req, res) => {
    try {
        const providers = await adminService.getAllProviders(req.query);
        return res.status(200).json({
            success: true,
            data: providers
        });
    } catch (err) {
        console.error("Get providers controller error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch providers."
        });
    }
};

const verifyProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const { isVerified } = req.body;
        const result = await adminService.verifyProvider(id, isVerified !== undefined ? isVerified : true);
        return res.status(200).json({
            success: true,
            message: `Provider status updated successfully.`,
            data: result
        });
    } catch (err) {
        console.error("Verify provider controller error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to update provider status."
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await adminService.deleteUser(id);
        return res.status(200).json({
            success: true,
            message: "User deleted successfully."
        });
    } catch (err) {
        console.error("Delete user controller error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to delete user."
        });
    }
};

module.exports = {
    getUsers,
    getProviders,
    verifyProvider,
    deleteUser
};
