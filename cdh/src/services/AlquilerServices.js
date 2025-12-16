import axiosInstance from "./axiosInstance";

// Alquileres
export const getAlquileres = () => axiosInstance.get("alquileres/alquiler/");
export const getAlquiler = (id) => axiosInstance.get(`alquileres/alquiler/${id}/`);
export const createAlquiler = (data) => axiosInstance.post("alquileres/alquiler/", data);
export const updateAlquiler = (id, data) => axiosInstance.put(`alquileres/alquiler/${id}/`, data);
export const deleteAlquiler = (id) => axiosInstance.delete(`alquileres/alquiler/${id}/`);

// Detalle del alquiler
export const getDetallesAlquiler = (alquilerId) => axiosInstance.get(`alquileres/detalle_alquiler/?alquiler_id=${alquilerId}`);
export const createDetalleAlquiler = (data) => axiosInstance.post("alquileres/detalle_alquiler/", data);
export const updateDetalleAlquiler = (id, data) => axiosInstance.put(`alquileres/detalle_alquiler/${id}/`, data);
export const deleteDetalleAlquiler = (id) => axiosInstance.delete(`alquileres/detalle_alquiler/${id}/`);

// Devoluciones
export const getDevoluciones = (alquilerId) => {
    const url = alquilerId ? `alquileres/devolucion/?alquiler_id=${alquilerId}` : "alquileres/devolucion/";
    return axiosInstance.get(url);
}
export const createDevolucion = (data) => axiosInstance.post("alquileres/devolucion/", data);
export const updateDevolucion = (id, data) => axiosInstance.put(`alquileres/devolucion/${id}/`, data);
export const deleteDevolucion = (id) => axiosInstance.delete(`alquileres/devolucion/${id}/`);

// Entregas
export const getEntregas = (alquilerId) => {
    const url = alquilerId ? `alquileres/entrega/?alquiler_id=${alquilerId}` : "alquileres/entrega/";
    return axiosInstance.get(url);
}
export const getEntrega = (id) => axiosInstance.get(`alquileres/entrega/${id}/`);
export const createEntrega = (data) => axiosInstance.post("alquileres/entrega/", data);
export const updateEntrega = (id, data) => axiosInstance.put(`alquileres/entrega/${id}/`, data);

// Retiros de Cliente
export const getRetirosCliente = () => axiosInstance.get("alquileres/retiro_cliente/");
export const getRetiroCliente = (id) => axiosInstance.get(`alquileres/retiro_cliente/${id}/`);
export const createRetiroCliente = (data) => axiosInstance.post("alquileres/retiro_cliente/", data);
export const updateRetiroCliente = (id, data) => axiosInstance.put(`alquileres/retiro_cliente/${id}/`, data);
export const deleteRetiroCliente = (id) => axiosInstance.delete(`alquileres/retiro_cliente/${id}/`);

// Subida de archivos (contratos)
export const uploadArchivoAlquiler = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance.post("alquileres/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};
