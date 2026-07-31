const providerService = require("./provider.service");

const getProviderDashboard = async (req, res) => {
    try {
        const providerId = req.user.id;
        const data = await providerService.getProviderDashboardData(providerId);
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

module.exports = {
    getProviderDashboard
};
