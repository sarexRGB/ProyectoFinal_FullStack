import axiosInstance from "./axiosInstance";

export const getClientes = () => axiosInstance.get("clientes/cliente/");
export const getCliente = (id) => axiosInstance.get(`clientes/cliente/${id}/`);
export const createCliente = (data) => axiosInstance.post("clientes/cliente/", data);
export const updateCliente = (id, data) => axiosInstance.put(`clientes/cliente/${id}/`, data);
export const deleteCliente = (id) => axiosInstance.delete(`clientes/cliente/${id}/`);