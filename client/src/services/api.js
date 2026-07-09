const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Registration failed");
        }
        return data;
    },

    login: async (credentials) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }
        return data;
    },

    getMe: async () => {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: getHeaders()
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to load user profile");
        }
        return data;
    }
};
