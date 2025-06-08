import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

type UserRole = 'ADMIN' | 'READ_ONLY'

export const useAuth = (requiredRole: UserRole = 'READ_ONLY', redirectTo = '/') => {
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

  const isAdmin = session?.user.role === 'ADMIN'
  const isReadOnly = session?.user.role === 'READ_ONLY'

  return {
    user: session?.user,
    isAdmin,
    isReadOnly,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated'
  }
}
