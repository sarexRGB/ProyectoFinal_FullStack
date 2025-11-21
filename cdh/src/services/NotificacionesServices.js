import axiosInstance from "./axiosInstance";

export const getNotificaciones = () => axiosInstance.get("notificaciones/notificacion/");
export const getNotificacion = (id) => axiosInstance.get(`notificaciones/notificacion/${id}/`);
export const createNotificacion = (data) => axiosInstance.post("notificaciones/notificacion/", data);
