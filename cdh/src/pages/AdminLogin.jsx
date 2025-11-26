import React from 'react'
import LoginForm from '@/components/LoginForm'

function AdminLogin() {
  return (
    <div className='min-h-screen justify-center items-center flex p-4'>
      <div className='w-full max-w-md'>
        <LoginForm />
      </div>
    </div>
  )
}

export default AdminLogin