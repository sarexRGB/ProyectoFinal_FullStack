import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import EmpleadoSidebar from '@/components/EmpleadoSidebar'

function EmpleadoLayout() {
    const [isExpanded, setIsExpanded] = useState(true)

    const toggleSidebar = () => setIsExpanded(!isExpanded)

    return (
        <div className='flex h-screen bg-gray-50'>
            <EmpleadoSidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
            <div className='flex-1 p-6 overflow-y-auto'>
                <Outlet />
            </div>
        </div>
    )
}

export default EmpleadoLayout