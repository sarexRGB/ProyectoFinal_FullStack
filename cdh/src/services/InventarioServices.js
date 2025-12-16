import axiosInstance from "./axiosInstance";

// Bodegas
export const getBodegas = () => axiosInstance.get("inventario/bodega/");
export const createBodega = (data) => axiosInstance.post("inventario/bodega/", data);
export const updateBodega = (id, data) => axiosInstance.put(`inventario/bodega/${id}/`, data);
export const deleteBodega = (id) => axiosInstance.delete(`inventario/bodega/${id}/`);

// Piezas
export const getPiezas = () => axiosInstance.get("inventario/pieza/");
export const getPieza = (id) => axiosInstance.get(`inventario/pieza/${id}/`);
export const createPieza = (data) => axiosInstance.post("inventario/pieza/", data);
export const updatePieza = (id, data) => axiosInstance.put(`inventario/pieza/${id}/`, data);
export const deletePieza = (id) => axiosInstance.delete(`inventario/pieza/${id}/`);

// Proveedores
export const getProveedores = () => axiosInstance.get("inventario/proveedor/");
export const createProveedor = (data) => axiosInstance.post("inventario/proveedor/", data);
export const updateProveedor = (id, data) => axiosInstance.put(`inventario/proveedor/${id}/`, data);
export const deteleProveedor = (id) => axiosInstance.delete(`inventario/proveedor/${id}/`);

// Inventario general
export const getInventario = (params) => axiosInstance.get("inventario/inventario/", { params: { ...params, t: Date.now() } });
export const createInventario = (data) => axiosInstance.post("inventario/inventario/", data);
export const updateInventario = (id, data) => axiosInstance.put(`inventario/inventario/${id}/`, data);
export const deleteInventario = (id) => axiosInstance.delete(`inventario/inventario/${id}/`);

// Inventario de piezas de repuestos
export const getInventarioPieza = (params) => axiosInstance.get("inventario/inventario_pieza/", { params: { ...params, t: Date.now() } });
export const createInventarioPieza = (data) => axiosInstance.post("inventario/inventario_pieza/", data);
export const updateInventarioPieza = (id, data) => axiosInstance.put(`inventario/inventario_pieza/${id}/`, data);
export const deleteInventarioPieza = (id) => axiosInstance.delete(`inventario/inventario_pieza/${id}/`);

// Movimientos de los inventarios
export const getMovimientos = () => axiosInstance.get("inventario/movimiento/");
export const createMovimiento = (data) => axiosInstance.post("inventario/movimiento/", data);
export const updateMovimiento = (id, data) => axiosInstance.put(`inventario/movimiento/${id}/`, data);
export const deleteMovimiento = (id) => axiosInstance.delete(`inventario/movimiento/${id}/`);
