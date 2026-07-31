const adminService = require("./admin.service");

/**
 * Controller handling Admin Dashboard overview.
 */
const getDashboard = async (req, res) => {
    try {
        const data = await adminService.getDashboardData();
        return res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        console.error("Admin dashboard controller error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch admin dashboard metrics."
        });
    }
};

/**
 * Controller handling Admin Analytics data.
 */
const getAnalytics = async (req, res) => {
    try {
        const data = await adminService.getAnalyticsData();
        return res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        console.error("Admin analytics controller error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch analytics data."
        });
    }
};

/**
 * Controller handling Admin Users listing.
 */
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

/**
 * Controller handling Admin Providers listing.
 */
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

/**
 * Controller handling Provider Verification toggle.
 */
const verifyProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const { isVerified } = req.body;
        const result = await adminService.verifyProvider(id, isVerified !== undefined ? isVerified : true);
        return res.status(200).json({
            success: true,
            message: "Provider status updated successfully.",
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

/**
 * Controller handling User deletion by Admin.
 */
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

/**
 * Controller handling Admin Services oversight.
 */
const getServices = async (req, res) => {
    try {
        const services = await adminService.getAllServices(req.query);
        return res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (err) {
        console.error("Admin get services controller error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch services."
        });
    }
};

/**
 * Controller handling Admin Bookings oversight.
 */
const getBookings = async (req, res) => {
    try {
        const bookings = await adminService.getAllBookings(req.query);
        return res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        console.error("Admin get bookings controller error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch bookings."
        });
    }
};

/**
 * Controller handling Admin Payments oversight.
 */
const getPayments = async (req, res) => {
    try {
        const payments = await adminService.getAllPayments();
        return res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (err) {
        console.error("Admin get payments controller error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch payments."
        });
    }
};

module.exports = {
    getDashboard,
    getAnalytics,
    getUsers,
    getProviders,
    verifyProvider,
    deleteUser,
    getServices,
    getBookings,
    getPayments
};
