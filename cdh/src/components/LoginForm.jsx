import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { AuthContext } from '@/services/AuthContext'

function LoginForm({ className, ...props }) {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const profile = await login(username, password)

      console.log('Profile:', profile)
      console.log('Roles:', profile.roles)

      const roles = profile.roles || []

      const normalizedRoles = roles.map(r => r.toLowerCase().trim())
      console.log('Normalized roles:', normalizedRoles)

      if (normalizedRoles.includes('administrador')) {
        console.log('Redirigiendo a /admin')
        navigate('/admin')
      }
      else if (normalizedRoles.some(r => ['chofer', 'mecanico', 'mecánico', 'despacho'].includes(r))) {
        console.log('Redirigiendo a /empleado')
        navigate('/empleado')
      }
      else {
        console.log('Redirigiendo a /')
        navigate('/')
      }

    } catch (err) {
      console.error(err)
      setError('Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className={cn('flex flex-col gap-6', className)} {...props}>
      <FieldGroup>
        <div className='flex flex-col items-center gap-1 text-center'>
          <h1 className='text-2xl font-bold'>Central de Herramientas</h1>
        </div>

        <Field>
          <FieldLabel htmlFor='username'>Username</FieldLabel>
          <Input
            id='username'
            type='text'
            placeholder='Username'
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Field>

        <Field>
          <div className='flex items-center'>
            <FieldLabel htmlFor='password'>Password</FieldLabel>
          </div>
          <Input
            id='password'
            type='password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        {error && (
          <div className='text-sm text-red-600 text-center'>
            {error}
          </div>
        )}

        <Field>
          <Button type='submit' disabled={loading} className='w-full'>
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default LoginForm
