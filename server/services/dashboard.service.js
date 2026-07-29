const dashboardRepository = require("../repositories/dashboard.repository");

/**
 * Service for computing Admin Dashboard metrics dynamically.
 */
const getAdminDashboardData = async () => {
    const totalUsers = await dashboardRepository.countTotalUsers();
    const totalProviders = await dashboardRepository.countTotalProviders();
    const totalBookings = await dashboardRepository.countTotalBookings();
    const totalRevenue = await dashboardRepository.aggregateTotalRevenue();

    const recentUsers = await dashboardRepository.getRecentUsers(5);
    const recentBookings = await dashboardRepository.getRecentBookings(5);
    const unverifiedProviders = await dashboardRepository.getUnverifiedProviders();

    return {
        stats: {
            totalUsers,
            totalProviders,
            totalBookings,
            totalRevenue: Math.round(totalRevenue * 100) / 100
        },
        recentUsers,
        recentBookings,
        unverifiedProviders
    };
};

/**
 * Service for computing Provider Dashboard metrics dynamically.
 */
const getProviderDashboardData = async (providerId) => {
    const providerStats = await dashboardRepository.getProviderStats(providerId);
    return providerStats;
};

/**
 * Service for computing Customer Dashboard metrics dynamically.
 */
const getCustomerDashboardData = async (customerId) => {
    const customerStats = await dashboardRepository.getCustomerStats(customerId);
    return customerStats;
};

module.exports = {
    getAdminDashboardData,
    getProviderDashboardData,
    getCustomerDashboardData
};
