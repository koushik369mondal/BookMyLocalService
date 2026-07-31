import { API_URL, getHeaders } from "./apiClient";

export const authService = {
    googleAuth: async ({ credential, role }) => {
        const response = await fetch(`${API_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential, role })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Google authentication failed");
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
    }
};
