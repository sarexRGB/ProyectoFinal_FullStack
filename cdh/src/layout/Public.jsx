import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

function Public() {
  return (
    <div className='flex flex-col min-h-screen'>
      <div className='fixed top-0 left-0 right-0 z-50 bg-background shadow-md'>
        <Navbar />
      </div>

      <main className='flex-grow w-full pt-30'>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default Public
