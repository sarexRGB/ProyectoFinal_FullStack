import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/AdminSidebar';


function AdminLayout() {
    const [isExpanded, setIsExpanded] = useState(true)

    const toggleSidebar = () => setIsExpanded(!isExpanded)

    return (
        <div className='flex h-screen bg.gray-50'>
            <AdminSidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
            <div className='flex-1 p-6 overflow-y-auto'>
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout