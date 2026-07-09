import React, { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const data = await authService.getMe();
            if (data.success) {
                setUser(data.user);
            } else {
                localStorage.removeItem("token");
                setUser(null);
            }
        } catch (error) {
            console.error("Error loading user session:", error);
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = async (identifier, password) => {
        setLoading(true);
        try {
            const data = await authService.login({ identifier, password });
            if (data.success) {
                localStorage.setItem("token", data.token);
                setUser(data.user);
                return data;
            }
            throw new Error(data.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    const register = async (fullName, email, phone, password, role) => {
        setLoading(true);
        try {
            const data = await authService.register({ fullName, email, phone, password, role });
            if (data.success) {
                localStorage.setItem("token", data.token);
                setUser(data.user);
                return data;
            }
            throw new Error(data.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, reloadUser: loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
