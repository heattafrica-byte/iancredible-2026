import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useProtectedRoute(requiredRole?: string) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login')
      } else if (requiredRole && user.role !== requiredRole) {
        router.push('/dashboard')
      }
    }
  }, [user, loading, requiredRole, router])

  return { user, loading }
}

export function useRequireAdmin() {
  return useProtectedRoute('admin')
}

export function useRequireArtist() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login')
      } else if (user.role !== 'artist' && user.role !== 'admin') {
        router.push('/dashboard')
      }
    }
  }, [user, loading, router])

  return { user, loading }
}
