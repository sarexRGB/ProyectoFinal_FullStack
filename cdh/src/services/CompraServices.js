import axiosInstance from "./axiosInstance";

// Orden de compra
export const getOrdenesCompra = () => axiosInstance.get("compras/orden_compra/");
export const getOrdenCompra = (id) => axiosInstance.get(`compras/orden_compra/${id}/`);
export const createOrdenCompra = (data) => axiosInstance.post("compras/orden_compra/", data);
export const updateOrdenCompra = (id, data) => axiosInstance.put(`compras/orden_compra/${id}/`, data);
export const deleteOrdenCompra = (id) => axiosInstance.delete(`compras/orden_compra/${id}/`);

// Detalle de compra
export const getDetallesCompra = () => axiosInstance.get("compras/detalle_compra/");
export const getDetallesPorOrden = (ordenId) => axiosInstance.get(`compras/detalle_compra/?orden_compra=${ordenId}`);
export const getDetalleCompra = (id) => axiosInstance.get(`compras/detalle_compra/${id}/`);
export const createDetalleCompra = (data) => axiosInstance.post("compras/detalle_compra/", data);
export const updateDetalleCompra = (id, data) => axiosInstance.put(`compras/detalle_compra/${id}/`, data);
export const deleteDetalleCompra = (id) => axiosInstance.delete(`compras/detalle_compra/${id}/`);
