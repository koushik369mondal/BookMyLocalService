import { api } from "./apiClient";

export const dashboardService = {
    getAdminDashboard: async () => {
        const response = await api.get("/dashboard/admin");
        return response.data;
    },

    getProviderDashboard: async () => {
        const response = await api.get("/dashboard/provider");
        return response.data;
    },

    getCustomerDashboard: async () => {
        const response = await api.get("/dashboard/customer");
        return response.data;
    }
};
