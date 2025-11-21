import axiosInstance from "./axiosInstance";

// Tipo de mantenimiento
export const getTiposMantenimiento = () => axiosInstance.get("mantenimiento/tipo_mantenimiento/");
export const getTipoMantenimiento = (id) => axiosInstance.get(`mantenimiento/tipo_mantenimiento/${id}/`);
export const createTipoMantenimiento = (data) => axiosInstance.post("mantenimiento/tipo_mantenimiento/", data);
export const updateTipoMantenimiento = (id, data) => axiosInstance.put(`mantenimiento/tipo_mantenimiento/${id}/`, data);
export const deleteTipoMantenimiento = (id) => axiosInstance.delete(`mantenimiento/tipo_mantenimiento/${id}/`);

// Mantenimiento de productos
export const getMantenimientosProducto = () => axiosInstance.get("mantenimiento/mantenimiento_producto/");
export const getMantenimientosProductoPorProducto = (productoId) => axiosInstance.get(`mantenimiento/mantenimiento_producto/?producto=${productoId}`);
export const getMantenimientoProducto = (id) => axiosInstance.get(`mantenimiento/mantenimiento_producto/${id}/`);
export const createMantenimientoProducto = (data) => axiosInstance.post("mantenimiento/mantenimiento_producto/", data);
export const updateMantenimientoProducto = (id, data) => axiosInstance.put(`mantenimiento/mantenimiento_producto/${id}/`, data);
export const deleteMantenimientoProducto = (id) => axiosInstance.delete(`mantenimiento/mantenimiento_producto/${id}/`);

// Mantenimiento de vehículos
export const getMantenimientosVehiculo = () => axiosInstance.get("mantenimiento/mantenimiento_vehiculo/");
export const getMantenimientosVehiculoPorVehiculo = (vehiculoId) => axiosInstance.get(`mantenimiento/mantenimiento_vehiculo/?vehiculo=${vehiculoId}`);
export const getMantenimientoVehiculo = (id) => axiosInstance.get(`mantenimiento/mantenimiento_vehiculo/${id}/`);
export const createMantenimientoVehiculo = (data) => axiosInstance.post("mantenimiento/mantenimiento_vehiculo/", data);
export const updateMantenimientoVehiculo = (id, data) => axiosInstance.put(`mantenimiento/mantenimiento_vehiculo/${id}/`, data);
export const deleteMantenimientoVehiculo = (id) => axiosInstance.delete(`mantenimiento/mantenimiento_vehiculo/${id}/`);

// Repuestos usados en una reparación
export const getMantenimientoPiezas = () => axiosInstance.get("mantenimiento/mantenimiento_pieza/");
export const getMantenimientoPiezasPorMantenimientoProducto = (mpId) => axiosInstance.get(`mantenimiento/mantenimiento_pieza/?mantenimiento_producto=${mpId}`);
export const getMantenimientoPiezasPorMantenimientoVehiculo = (mvId) => axiosInstance.get(`mantenimiento/mantenimiento_pieza/?mantenimiento_vehiculo=${mvId}`);
export const getMantenimientoPieza = (id) => axiosInstance.get(`mantenimiento/mantenimiento_pieza/${id}/`);
export const createMantenimientoPieza = (data) => axiosInstance.post("mantenimiento/mantenimiento_pieza/", data);
export const updateMantenimientoPieza = (id, data) => axiosInstance.put(`mantenimiento/mantenimiento_pieza/${id}/`, data);
export const deleteMantenimientoPieza = (id) => axiosInstance.delete(`mantenimiento/mantenimiento_pieza/${id}/`);
