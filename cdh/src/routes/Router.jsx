import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Public from '@/layout/Public.jsx';
import AboutUsPage from '@/pages/AboutUsPage.jsx';
import LandingPage from '@/pages/LandingPage.jsx';
import CatalogosPublicPage from '@/pages/CatalogosPublicPage.jsx';
import AdminLogin from '@/pages/AdminLogin.jsx';
import PrivateLayout from '@/layout/PrivateLayout';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminInventario from '@/pages/AdminInventario';
import AdminHistorial from '@/pages/AdminHistorial';
import AdminPersonal from '@/pages/AdminPersonal';
import AdminPerfiles from '@/pages/AdminPerfiles';
import AdminAlquiler from '@/pages/AdminAlquiler';
import AdminVenta from '@/pages/AdminVenta';
import DetallesPage from '@/pages/DetallesPage';
import CatModProvPage from '@/pages/CatModProvPage';
import Roles from '@/components/Roles';
import AdminClientes from '@/pages/AdminClientes';
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
          <Route path="about" element={<AboutUsPage />} />
          <Route path="catalogos" element={<CatalogosPublicPage />} />
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
          <Route path='inventario' element={<AdminInventario />} />
          <Route path='inventario/config/:type' element={<CatModProvPage />} />
          <Route path='historial' element={<AdminHistorial />} />
          <Route path='historial/detalles/:id' element={<DetallesPage />} />
          <Route path='clientes' element={<AdminClientes />} />
          <Route path='personal' element={<AdminPersonal />} />
          <Route path='roles' element={<Roles />} />
          <Route path='personal/:id' element={<AdminPerfiles />} />
          <Route path='alquiler' element={<AdminAlquiler />} />
          <Route path='venta' element={<AdminVenta />} />
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
