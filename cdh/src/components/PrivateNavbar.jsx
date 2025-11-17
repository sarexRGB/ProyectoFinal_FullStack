import React from 'react'
import { SidebarTrigger } from './ui/sidebar'

function PrivateNavbar() {
    return (
        <div className='flex items-center gap-2 sticky top-0 z-10 bg-sidebar'>
            <SidebarTrigger />
            <h1 className='text-lg font-semibold md:text-2xl'>Dashboard</h1>
        </div>
    )
}

export default PrivateNavbar