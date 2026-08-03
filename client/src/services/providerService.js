import { api } from "./apiClient";

export const providerService = {
    getDashboard: async () => {
        const response = await api.get("/provider/dashboard");
        return response.data;
    },

    getServices: async () => {
        const response = await api.get("/provider/services");
        return response.data;
    },

    createService: async (serviceData) => {
        const response = await api.post("/provider/services", serviceData);
        return response.data;
    },

    updateService: async (id, serviceData) => {
        const response = await api.put(`/provider/services/${id}`, serviceData);
        return response.data;
    },

    deleteService: async (id) => {
        const response = await api.delete(`/provider/services/${id}`);
        return response.data;
    },

    getJobs: async () => {
        const response = await api.get("/provider/jobs");
        return response.data;
    },

    updateJobStatus: async (id, status) => {
        const response = await api.put(`/provider/jobs/${id}/status`, { status });
        return response.data;
    },

    getEarnings: async () => {
        const response = await api.get("/provider/earnings");
        return response.data;
    },

    getReviews: async () => {
        const response = await api.get("/provider/reviews");
        return response.data;
    },

    replyToReview: async (id, reply) => {
        const response = await api.post(`/provider/reviews/${id}/reply`, { reply });
        return response.data;
    },

    getAvailability: async () => {
        const response = await api.get("/provider/availability");
        return response.data;
    },

    saveAvailability: async (weeklySchedule, blockedDates) => {
        const response = await api.put("/provider/availability", { weeklySchedule, blockedDates });
        return response.data;
    }
};
