import axiosInstance from "./axiosInstance";

export const getPagos = () => axiosInstance.get("finanzas/pago/");
export const getPago = (id) => axiosInstance.get(`finanzas/pago/${id}/`);
export const createPago = (data) => axiosInstance.post("finanzas/pago/", data);
export const updatePago = (id, data) => axiosInstance.put(`finanzas/pago/${id}/`, data);
export const deletePago = (id) => axiosInstance.delete(`finanzas/pago/${id}/`);

