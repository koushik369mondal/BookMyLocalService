import React, { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            localStorage.removeItem("user");
            setLoading(false);
            return;
        }

        try {
            const data = await authService.getMe();
            if (data.success) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
            } else {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            }
        } catch (error) {
            console.error("Error loading user session:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
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
                localStorage.setItem("user", JSON.stringify(data.user));
                setUser(data.user);
                return data;
            }
            throw new Error(data.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    const registerSendOtp = async (userData) => {
        setLoading(true);
        try {
            const data = await authService.registerSendOtp(userData);
            return data;
        } finally {
            setLoading(false);
        }
    };

    const loginSendOtp = async (email) => {
        setLoading(true);
        try {
            const data = await authService.loginSendOtp(email);
            return data;
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (email, otp, flow) => {
        setLoading(true);
        try {
            const data = flow === "register"
                ? await authService.registerVerifyOtp(email, otp)
                : await authService.loginVerifyOtp(email, otp);
            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                setUser(data.user);
                return data;
            }
            throw new Error(data.message || "OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async (email, flow, registerData) => {
        setLoading(true);
        try {
            const data = flow === "register"
                ? await authService.registerSendOtp(registerData)
                : await authService.loginSendOtp(email);
            return data;
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
                localStorage.setItem("user", JSON.stringify(data.user));
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
        localStorage.removeItem("user");
        setUser(null);
    };

    const switchRole = async (targetRole) => {
        setLoading(true);
        try {
            const data = await authService.updateProfile({ role: targetRole });
            if (data.success) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                return data;
            }
            throw new Error(data.message || "Failed to switch role");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, reloadUser: loadUser, registerSendOtp, loginSendOtp, verifyOtp, resendOtp, switchRole }}>
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
