const dashboardRepository = require("../dashboard/dashboard.repository");
const authService = require("../auth/auth.service");

class CustomerService {
    async getCustomerDashboardData(customerId) {
        return await dashboardRepository.getCustomerStats(customerId);
    }

    async getProfile(customerId) {
        return await authService.getUserProfile(customerId);
    }

    async updateProfile(customerId, data) {
        return await authService.updateUserProfile(customerId, data);
    }
}

module.exports = new CustomerService();
