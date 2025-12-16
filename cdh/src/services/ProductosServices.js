import axiosInstance from "./axiosInstance";

// Productos
export const getProductos = () => axiosInstance.get("productos/producto/", { params: { t: Date.now() } });
export const getProducto = (id) => axiosInstance.get(`productos/producto/${id}/`, { params: { t: Date.now() } });
export const createProducto = (data) => axiosInstance.post("productos/producto/", data);
export const updateProducto = (id, data) => axiosInstance.put(`productos/producto/${id}/`, data);
export const deleteProducto = (id) => axiosInstance.delete(`productos/producto/${id}/`);

// Categorías
export const getCategorias = () => axiosInstance.get("productos/categoria/");
export const getCategoria = (id) => axiosInstance.get(`productos/categoria/${id}/`);
export const createCategoria = (data) => axiosInstance.post("productos/categoria/", data);
export const updateCategoria = (id, data) => axiosInstance.put(`productos/categoria/${id}/`, data);
export const deleteCategoria = (id) => axiosInstance.delete(`productos/categoria/${id}/`);

// Modalidades
export const getModalidades = () => axiosInstance.get("productos/modalidad/");
export const getModalidad = (id) => axiosInstance.get(`productos/modalidad/${id}/`);
export const createModalidad = (data) => axiosInstance.post("productos/modalidad/", data);
export const updateModalidad = (id, data) => axiosInstance.put(`productos/modalidad/${id}/`, data);
export const deleteModalidad = (id) => axiosInstance.delete(`productos/modalidad/${id}/`);

// Modalidades por Producto
export const getProductoModalidades = () => axiosInstance.get("productos/modalidadproducto/");
export const getProductoModalidad = (id) => axiosInstance.get(`productos/modalidadproducto/${id}/`);
export const createProductoModalidad = (data) => axiosInstance.post("productos/modalidadproducto/", data);
export const updateProductoModalidad = (id, data) => axiosInstance.put(`productos/modalidadproducto/${id}/`, data);
export const deleteProductoModalidad = (id) => axiosInstance.delete(`productos/modalidadproducto/${id}/`);

// Subida de imagen
export const uploadArchivo = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance.post("productos/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data", },
    });
};