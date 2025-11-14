import React, { useState } from 'react';
import { login } from '@/services/auth';
import { Lock, User, LogIn } from 'lucide-react';
import { Button } from './ui/button';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    setError("");
    setLoading(true);

    try {
    await login(username, password);
      onLogin();
    } catch {
      setError("Usuario o contraseña incorrectos")
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50'>
      <div className='w-full max-w-sm rounded-2x1 bg-white p-8 shadow-lg'>
        <div className='mb-6 text-center'>
          <LogIn className='text-2x1 font-semibold text-gray-800' />
          <h2 className='text-2x1 font-semibold text-gray-500'>
            Iniciar sesión
          </h2>
          <p className='text-sm text-gray-500'>Accede a tu cuenta</p>
        </div>

        <div className='mb-4'>
          <label className='mb-1 block text-sm font-medium text-gray-700'>
            Usuario
          </label>
          <div className='relative'>
            <User className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
            <input
              type="text"
              placeholder='Nombre de usuario'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className='w-full rounded-xl border border-gray-300 pl-10 pr-3 py-2 text-gary-800 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-200 focus:ring-opacity-50'
            />
          </div>
        </div>

        <div className='mb-4'>
          <label className='mb-1 block text-sm font-medium text-gray-700'>
            Contraseña
          </label>
          <div className='relative'>
            <Lock className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
            <input
              type="password"
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full rounded-xl border border-gray-300 pl-10 pr-3 py-2 text.gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring.opacity-50'
            />
          </div>
        </div>

        {error && (
          <p className='mb-3 text-sm font-medium text-red-600 text-center'>
            {error}
          </p>
        )}

        <div className='mt-4'>
          <Button>
            Entrar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LoginForm