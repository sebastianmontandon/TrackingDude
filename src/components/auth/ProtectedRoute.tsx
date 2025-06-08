'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

type UserRole = 'ADMIN' | 'READ_ONLY'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  loadingComponent?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredRole = 'READ_ONLY',
  loadingComponent = <div>Loading...</div> 
}: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    
    // Si no hay sesión, redirigir al login
    if (!session) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    // Si el rol del usuario no es suficiente, redirigir al dashboard
    if (session.user.role === 'READ_ONLY' && requiredRole === 'ADMIN') {
      router.push('/dashboard')
    }
  }, [session, status, router, requiredRole])

  if (status === 'loading') {
    return <>{loadingComponent}</>
  }

  if (!session) {
    return null // Redirección manejada por el efecto
  }

  // Si el rol no es suficiente, mostrará el componente de carga hasta la redirección
  if (session.user.role === 'READ_ONLY' && requiredRole === 'ADMIN') {
    return <>{loadingComponent}</>
  }

  return <>{children}</>
}
