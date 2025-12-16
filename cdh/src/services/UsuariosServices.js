import axiosInstance from "./axiosInstance";

// Usuarios
export const getUsuarios = () => axiosInstance.get("usuarios/usuario/");
export const getUsuario = (id) => axiosInstance.get(`usuarios/usuario/${id}/`);
export const createUsuario = (data) => axiosInstance.post("usuarios/usuario/", data);
export const updateUsuario = (id, data) => axiosInstance.put(`usuarios/usuario/${id}/`, data);
export const deleteUsuario = (id) => axiosInstance.delete(`usuarios/usuario/${id}/`);
export const getProfile = () => axiosInstance.get("usuarios/profile/");
export const resetPassword = (id) => axiosInstance.post(`usuarios/usuario/${id}/reset-password/`);

// Roles de empleados
export const getRolesEmpleado = () => axiosInstance.get("usuarios/roles/");
export const getRolEmpleado = (id) => axiosInstance.get(`usuarios/roles/${id}/`);
export const createRolEmpleado = (data) => axiosInstance.post("usuarios/roles/", data);
export const updateRolEmpleado = (id, data) => axiosInstance.put(`usuarios/roles/${id}/`, data);
export const deleteRolEmpleado = (id) => axiosInstance.delete(`usuarios/roles/${id}/`);

// Choferes
export const getChoferes = () => axiosInstance.get("usuarios/chofer/");
export const getChofer = (id) => axiosInstance.get(`usuarios/chofer/${id}/`);
export const createChofer = (data) => axiosInstance.post("usuarios/chofer/", data);
export const updateChofer = (id, data) => axiosInstance.put(`usuarios/chofer/${id}/`, data);
export const deleteChofer = (id) => axiosInstance.delete(`usuarios/chofer/${id}/`);

// Mecánicos
export const getMecanicos = () => axiosInstance.get("usuarios/mecanico/");
export const getMecanico = (id) => axiosInstance.get(`usuarios/mecanico/${id}/`);
export const createMecanico = (data) => axiosInstance.post("usuarios/mecanico/", data);
export const updateMecanico = (id, data) => axiosInstance.put(`usuarios/mecanico/${id}/`, data);
export const deleteMecanico = (id) => axiosInstance.delete(`usuarios/mecanico/${id}/`);

// Despachadores
export const getDespachadores = () => axiosInstance.get("usuarios/despacho/");
export const getDespachador = (id) => axiosInstance.get(`usuarios/despacho/${id}/`);
export const createDespachador = (data) => axiosInstance.post("usuarios/despacho/", data);
export const updateDespachador = (id, data) => axiosInstance.put(`usuarios/despacho/${id}/`, data);
export const deleteDespachador = (id) => axiosInstance.delete(`usuarios/despacho/${id}/`);

// Asistencias
export const getAsistencias = () => axiosInstance.get("usuarios/asistencia/");
export const getAsistencia = (id) => axiosInstance.get(`usuarios/asistencia/${id}/`);
export const createAsistencia = (data) => axiosInstance.post("usuarios/asistencia/", data);
export const updateAsistencia = (id, data) => axiosInstance.put(`usuarios/asistencia/${id}/`, data);
export const deleteAsistencia = (id) => axiosInstance.delete(`usuarios/asistencia/${id}/`);

// empleados
export const getEmpleados = () => axiosInstance.get("usuarios/empleados/")