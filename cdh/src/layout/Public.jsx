import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

function Public() {
  return (
    <div>
      <Navbar />
      <main className='w-screen h-screen'>
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}

export default Public