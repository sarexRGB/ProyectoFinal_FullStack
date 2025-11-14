import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Public from '@/layout/public'
import LandigPage from '@/pages/LandigPage'
import AdminLogin from '@/pages/AdminLogin'
import AdminLayout from '@/layout/AdminLayout'
import AdminDasboard from '@/pages/AdminDasboard'
import AdminInventario from '@/pages/AdminInventario'
import AdminContratos from '@/pages/AdminContratos'
import AdminPersonal from '@/pages/AdminPersonal'
import AdminAlquiler from '@/pages/AdminAlquiler'
import AdminVenta from '@/pages/AdminVenta'
import EmpleadoLayout from '@/layout/EmpleadoLayout'
import EmpleadoDashboard from '@/pages/EmpleadoDashboard'
import EmpleadoPerfil from '@/pages/EmpleadoPerfil'
import EmpleadoTareas from '@/pages/EmpleadoTareas'

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Public />}>
          <Route index element={<LandigPage />} />
        </Route>

        <Route path='/login' element={<AdminLogin />} />

        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminDasboard />} />
          <Route path='inventario' element={<AdminInventario />} />
          <Route path='personal' element={<AdminPersonal />} />
          <Route path='contratos' element={<AdminContratos />} />
          <Route path='alquiler' element={<AdminAlquiler />} />
          <Route path='venta' element={<AdminVenta />} />
        </Route>

        <Route path='/empleado' element={<EmpleadoLayout />}>
          <Route index element={<EmpleadoDashboard />} />
          <Route path='perfil' element={<EmpleadoPerfil />} />
          <Route path='tareas' element={<EmpleadoTareas />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default Router