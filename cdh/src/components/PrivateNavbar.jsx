import React from 'react'
import { useLocation } from 'react-router-dom'
import { SidebarTrigger } from './ui/sidebar'

function PrivateNavbar() {
    const location = useLocation()

    const routeTitles = {
        '/admin' : 'Dashboard Administrativo',
        '/admin/inventario' : 'Inventario',
        '/admin/historial' : 'Historial de Alquileres',
        '/admin/personal' : 'Personal de la Empresa',
        '/admin/alquiler' : 'Catálogo de Alquiler',
        '/admin/venta' : 'Catálogo de Venta',
        '/empleado' : 'Dashboard',
        '/empleado/tareas' : 'Tareas',
        '/empleado/perfil' : 'Perfil',
    }

    const currentTitle = routeTitles[location.pathname] || " "

    return (
        <div className='flex items-center gap-2 sticky top-0 z-10 bg-sidebar'>
            <SidebarTrigger />
            <h1 className='text-lg font-semibold md:text-2xl'>{currentTitle}</h1>
        </div>
    )
}

export default PrivateNavbar