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

    sendOtp: async (email) => {
        const response = await fetch(`${API_URL}/auth/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to send OTP");
        return data;
    },

    verifyOtp: async (email, otp) => {
        const response = await fetch(`${API_URL}/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "OTP verification failed");
        return data;
    },

    resendOtp: async (email) => {
        const response = await fetch(`${API_URL}/auth/resend-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to resend OTP");
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

export const bookingsService = {
    getBookings: async () => {
        const response = await api.get("/bookings");
        return response.data;
    },

    getBookingById: async (id) => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },

    createBooking: async (bookingData) => {
        const response = await api.post("/bookings", bookingData);
        return response.data;
    },

    updateBooking: async (id, bookingData) => {
        const response = await api.put(`/bookings/${id}`, bookingData);
        return response.data;
    },

    deleteBooking: async (id) => {
        const response = await api.delete(`/bookings/${id}`);
        return response.data;
    }
};

export const checkoutService = {
    getCheckoutDetails: async (bookingId) => {
        const response = await api.get(`/checkout/${bookingId}`);
        return response.data;
    },

    submitCheckout: async (checkoutData) => {
        const response = await api.post("/checkout", checkoutData);
        return response.data;
    },

    processPayment: async (paymentData) => {
        const response = await api.post("/payment", paymentData);
        return response.data;
    }
};
