'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, LogIn, RefreshCw, AlertCircle } from 'lucide-react'

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
        callbackUrl: '/dashboard'
      })

      if (result?.error) {
        setError('Credenciales inválidas')
      } else {
        window.location.href = result?.url || '/';
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

  // Animated background effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  useEffect(() => {
    // Simulate loading completion
    const timer = setTimeout(() => setIsLoadingComplete(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative bg-gray-900"
      style={{
        background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Animated background elements */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.15), transparent 20%)`,
          transition: 'background 0.3s ease-out',
        }}
      />
      
      {/* Decorative shapes */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-900/30 rounded-full mix-blend-overlay filter blur-xl opacity-50 animate-blob" />
      <div className="absolute top-1/2 -right-10 w-64 h-64 bg-purple-900/30 rounded-full mix-blend-overlay filter blur-xl opacity-50 animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-900/30 rounded-full mix-blend-overlay filter blur-xl opacity-50 animate-blob animation-delay-4000" />

      <div className={`w-full max-w-md relative z-10 transition-all duration-700 ease-out transform ${isLoadingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-700/30">
          <div className="px-8 py-10 sm:p-10">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/80 mb-4 shadow-lg">
                <img src="/favicon.png" alt="Logo" className="w-18 h-18" />
              </div>
              <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                TrackingDude
              </h1>
              <p className="mt-2 text-sm text-gray-300">
                Gestiona tus dominios y hosting en un solo lugar
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-600/50 rounded-xl bg-gray-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-white disabled:opacity-70 disabled:cursor-not-allowed"
                    placeholder="Correo electrónico"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-600/50 rounded-xl bg-gray-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-white disabled:opacity-70 disabled:cursor-not-allowed"
                    placeholder="Contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-900/30 p-4 border border-red-800/30 backdrop-blur-sm">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-200">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/10 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-200 transform hover:-translate-y-0.5 ${
                  isLoading ? 'opacity-80 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <LogIn className="absolute left-4 h-5 w-5 text-indigo-200 group-hover:text-white transition-colors" />
                    Iniciar sesión
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Demo credentials card */}
        <div className="mt-8 bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/30">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-indigo-900/30 text-indigo-400 mr-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-base font-medium text-white">Credenciales de prueba</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start">
              <span className="w-24 text-base text-gray-300 mt-1">Email:</span>
              <div className="flex-1">
                <div className="font-mono bg-gray-700/50 px-3 py-2 rounded-lg text-sm text-white w-full">
                  admin@example.com
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <span className="w-24 text-base text-gray-300 mt-1">Contraseña:</span>
              <div className="flex-1">
                <div className="font-mono bg-gray-700/50 px-3 py-2 rounded-lg text-sm text-white w-full">
                  password123
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}