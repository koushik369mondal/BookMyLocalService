const dashboardService = require("./dashboard.service");

/**
 * Controller for Admin Dashboard API.
 */
const getAdminDashboard = async (req, res) => {
    try {
        const data = await dashboardService.getAdminDashboardData();
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
 * Controller for Provider Dashboard API.
 */
const getProviderDashboard = async (req, res) => {
    try {
        const providerId = req.user.id;
        const data = await dashboardService.getProviderDashboardData(providerId);
        return res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        console.error("Provider dashboard controller error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch provider dashboard metrics."
        });
    }
};

/**
 * Controller for Customer Dashboard API.
 */
const getCustomerDashboard = async (req, res) => {
    try {
        const customerId = req.user.id;
        const data = await dashboardService.getCustomerDashboardData(customerId);
        return res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        console.error("Customer dashboard controller error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch customer dashboard metrics."
        });
    }
};

module.exports = {
    getAdminDashboard,
    getProviderDashboard,
    getCustomerDashboard
};
