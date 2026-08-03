import { api } from "./apiClient";

export const servicesService = {
    getServices: async (params = {}) => {
        const response = await api.get("/services", { params });
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get("/services/categories");
        return response.data;
    },

    getServiceById: async (id) => {
        const response = await api.get(`/services/${id}`);
        return response.data;
    },

    getServiceBySlug: async (slug) => {
        const response = await api.get(`/services/slug/${slug}`);
        return response.data;
    },

    getProviderServices: async () => {
        const response = await api.get("/provider/services");
        return response.data;
    },

    createProviderService: async (data) => {
        const isFormData = data instanceof FormData;
        const response = await api.post("/provider/services", data, {
            headers: isFormData ? { "Content-Type": "multipart/form-data" } : {}
        });
        return response.data;
    },

    updateProviderService: async (id, data) => {
        const isFormData = data instanceof FormData;
        const response = await api.put(`/provider/services/${id}`, data, {
            headers: isFormData ? { "Content-Type": "multipart/form-data" } : {}
        });
        return response.data;
    },

    deleteProviderService: async (id) => {
        const response = await api.delete(`/provider/services/${id}`);
        return response.data;
    },

    createService: async (formData) => {
        const response = await api.post("/services", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    },

    updateService: async (id, formData) => {
        const response = await api.put(`/services/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    },

    deleteService: async (id) => {
        const response = await api.delete(`/services/${id}`);
        return response.data;
    }
};
