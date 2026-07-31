const customerService = require("./customer.service");

const getCustomerDashboard = async (req, res) => {
    try {
        const customerId = req.user.id;
        const data = await customerService.getCustomerDashboardData(customerId);
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

const getCustomerProfile = async (req, res) => {
    try {
        const customerId = req.user.id;
        const user = await customerService.getProfile(customerId);
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error("Customer profile controller error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch profile."
        });
    }
};

module.exports = {
    getCustomerDashboard,
    getCustomerProfile
};
