import { API_URL, getHeaders } from "./apiClient";

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

    registerSendOtp: async (userData) => {
        const response = await fetch(`${API_URL}/auth/register/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to send registration OTP");
        return data;
    },

    registerVerifyOtp: async (email, otp) => {
        const response = await fetch(`${API_URL}/auth/register/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "OTP verification failed");
        return data;
    },

    loginSendOtp: async (email) => {
        const response = await fetch(`${API_URL}/auth/login/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to send login OTP");
        return data;
    },

    loginVerifyOtp: async (email, otp) => {
        const response = await fetch(`${API_URL}/auth/login/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "OTP verification failed");
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
