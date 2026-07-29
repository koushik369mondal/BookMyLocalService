import { api } from "./apiClient";

export const adminService = {
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
    }
};
