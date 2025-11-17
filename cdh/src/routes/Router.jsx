import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Public from '@/layout/Public.jsx';
import LandingPage from '@/pages/LandingPage.jsx';
import AdminLogin from '@/pages/AdminLogin.jsx';
import PrivateLayout from '@/layout/PrivateLayout';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminInventario from '@/pages/AdminInventario';
import AdminHistorial from '@/pages/AdminHistorial';
import AdminPersonal from '@/pages/AdminPersonal';
import AdminAlquiler from '@/pages/AdminAlquiler';
import AdminVenta from '@/pages/AdminVenta';
import EmpleadoDashboard from '@/pages/EmpleadoDashboard.jsx';
import EmpleadoPerfil from '@/pages/EmpleadoPerfil.jsx';
import EmpleadoTareas from '@/pages/EmpleadoTareas.jsx';
import ProtectedRoute from '@/components/ProtectedRouter';
import RoleRoute from '@/components/RoleRouter';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Public />}>
          <Route index element={<LandingPage />} />
        </Route>
        <Route path="/login" element={<AdminLogin />} />

        {/* Rutas protegidas admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["Administrador"]}>
                <PrivateLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path='inventario' element={<AdminInventario/>} />
          <Route path='historial' element={<AdminHistorial/>} />
          <Route path='personal' element={<AdminPersonal/>} />
          <Route path='alquiler' element={<AdminAlquiler/>} />
          <Route path='venta' element={<AdminVenta/>} />
        </Route>

        {/* Rutas protegidas empleados */}
        <Route
          path="/empleado"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["Chofer", "Mecánico", "Despacho"]}>
                <PrivateLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<EmpleadoDashboard />} />
          <Route path="perfil" element={<EmpleadoPerfil />} />
          <Route path="tareas" element={<EmpleadoTareas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
