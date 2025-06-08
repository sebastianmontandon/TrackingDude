'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl: '/' // Redirigir a la página principal después del login
      })

      if (result?.error) {
        setError('Credenciales inválidas')
      } else {
        // Redirigir a la página principal
        window.location.href = result?.url || '/'; // Usar window.location para forzar una recarga completa
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          <div className="text-center">
            <div className="mx-auto h-18 w-18 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <img src="/favicon.png" alt="Logo" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Iniciar Sesión</h2>
            <p className="mt-2 text-muted-foreground">
              Accede a tu panel de TrackingDude
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                    placeholder="Tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-5 w-5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Iniciar Sesión
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                TrackingDude - Sistema de Gestión de Dominios
              </p>
            </div>
          </form>
        </div>
        
        {/* Demo credentials info */}
        <div className="bg-card/50 border border-border rounded-lg p-4 mb-4">
          <div className="text-center">
            <h3 className="text-sm font-medium text-foreground mb-2">Credenciales de Prueba</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><strong>Email:</strong> lector@ejemplo.com</p>
              <p><strong>Contraseña:</strong> lector123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 