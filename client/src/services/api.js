import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

const getHeaders = () => {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json"
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
};

export const authService = {
    register: async (userData) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Registration failed");
        return data;
    },

    login: async (credentials) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Login failed");
        return data;
    },

    getMe: async () => {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: getHeaders()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to load user profile");
        return data;
    },

    updateProfile: async (profileData) => {
        const response = await fetch(`${API_URL}/profile`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(profileData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to update profile");
        return data;
    },

    uploadAvatar: async (formData) => {
        const token = localStorage.getItem("token");
        const headers = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch(`${API_URL}/profile/avatar`, {
            method: "POST",
            headers,
            body: formData
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to upload avatar");
        return data;
    },

    changePassword: async (passwordData) => {
        const response = await fetch(`${API_URL}/auth/password`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(passwordData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to change password");
        return data;
    }
};

export const servicesService = {
    getServices: async (params = {}) => {
        const response = await api.get("/services", { params });
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
