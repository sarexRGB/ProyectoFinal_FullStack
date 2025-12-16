import React, { createContext, useState, useEffect, useContext } from "react";
import { loginRequest, getProfile, logoutRequest } from "./authServices";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeUser = async () => {
            const access = localStorage.getItem("access");

            if (access) {
                try {
                    const profile = await getProfile();

                    setUser(profile);
                    setRoles(profile.roles || []);
                } catch {
                    localStorage.clear();
                    setUser(null);
                    setRoles([]);
                }
            }

            setLoading(false);
        };

        initializeUser();
    }, []);

    const login = async (username, password) => {
        const data = await loginRequest(username, password);
        const profile = await getProfile();

        setUser(profile);
        setRoles(profile.roles || []);

        return profile;
    };

    const logout = async () => {
        await logoutRequest();
        setUser(null);
        setRoles([]);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                roles,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
