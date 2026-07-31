const dashboardRepository = require("../dashboard/dashboard.repository");

class ProviderService {
    async getProviderDashboardData(providerId) {
        return await dashboardRepository.getProviderStats(providerId);
    }
}

module.exports = new ProviderService();
