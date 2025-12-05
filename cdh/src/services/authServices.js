import axiosInstance from "./axiosInstance";
import { toast } from "sonner";

export const loginRequest = async (username, password) => {
    const response = await axiosInstance.post("auth/login/", { username, password });
    const { access, refresh, rol } = response.data;

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("rol", rol);

    return response.data;
};

export const getProfile = async () => {
    const response = await axiosInstance.get("usuarios/profile/");
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await axiosInstance.put("usuarios/profile/update/", data);
    return response.data;
};

export const logoutRequest = async () => {
    const refresh = localStorage.getItem("refresh");
    if (refresh) {
        try {
            await axiosInstance.post("auth/logout/", { refresh });
        } catch (err) {
            console.log("Error enviando logout al backend", err);
            toast.error("Error enviando logout al backend");
        }
    }
    localStorage.clear();
};

export const registerUser = (data) => axiosInstance.post("auth/register/", data);