import axiosInstance from "/axiosInstance";

// Ventas
export const getVentas = () => axiosInstance.get("ventas/venta/");
export const getVenta = (id) => axiosInstance.get(`ventas/venta/${id}/`);
export const createVenta = (data) => axiosInstance.post("ventas/venta/", data);
export const updateVenta = (id, data) => axiosInstance.put(`ventas/venta/${id}/`, data);
export const deleteVenta = (id) => axiosInstance.delete(`ventas/venta/${id}/`);

// Detalles de venta
export const getDetallesPorVenta = (ventaId) => axiosInstance.get(`ventas/detalleVenta/?venta_id=${ventaId}`);
export const createDetalleVenta = (data) => axiosInstance.post("ventas/detalleVenta/", data);
export const updateDetalleVenta = (id, data) => axiosInstance.put(`ventas/detalleVenta/${id}/`, data);
export const deleteDetalleVenta = (id) => axiosInstance.delete(`ventas/detalleVenta/${id}/`);
