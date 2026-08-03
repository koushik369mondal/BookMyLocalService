import { api } from "./apiClient";

export const adminService = {
    getDashboard: async () => {
        const response = await api.get("/admin/dashboard");
        return response.data;
    },

    getAnalytics: async () => {
        const response = await api.get("/admin/analytics");
        return response.data;
    },

    getUsers: async (params = {}) => {
        const response = await api.get("/admin/users", { params });
        return response.data;
    },

    getProviders: async (params = {}) => {
        const response = await api.get("/admin/providers", { params });
        return response.data;
    },

    verifyProvider: async (id, isVerified = true) => {
        const response = await api.put(`/admin/verify-provider/${id}`, { isVerified });
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    },

    getServices: async (params = {}) => {
        const response = await api.get("/admin/services", { params });
        return response.data;
    },

    getBookings: async (params = {}) => {
        const response = await api.get("/admin/bookings", { params });
        return response.data;
    },

    getPayments: async () => {
        const response = await api.get("/admin/payments");
        return response.data;
    }
};
