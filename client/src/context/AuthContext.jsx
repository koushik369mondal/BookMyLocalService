import React, { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../services/authService";

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

    const googleLogin = async (credential, role) => {
        setLoading(true);
        try {
            const data = await authService.googleAuth({ credential, role });
            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                setUser(data.user);
                return data;
            }
            throw new Error(data.message || "Google authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    const updateProfile = async (profileData) => {
        setLoading(true);
        try {
            const data = await authService.updateProfile(profileData);
            if (data.success) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                return data;
            }
            throw new Error(data.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const switchRole = async (targetRole) => {
        return await updateProfile({ role: targetRole });
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, reloadUser: loadUser, googleLogin, updateProfile, switchRole }}>
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
