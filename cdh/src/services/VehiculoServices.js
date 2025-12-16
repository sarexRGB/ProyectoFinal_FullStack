import axiosInstance from "./axiosInstance";

// Vehículos
export const getVehiculos = () => axiosInstance.get("vehiculos/vehiculo/", { params: { t: Date.now() } });
export const getVehiculo = (id) => axiosInstance.get(`vehiculos/vehiculo/${id}/`, { params: { t: Date.now() } });
export const createVehiculo = (data) => axiosInstance.post("vehiculos/vehiculo/", data);
export const updateVehiculo = (id, data) => axiosInstance.put(`vehiculos/vehiculo/${id}/`, data);
export const deleteVehiculo = (id) => axiosInstance.delete(`vehiculos/vehiculo/${id}/`);
