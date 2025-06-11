'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from './AuthProvider'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  console.log('🔐 ProtectedRoute: Component initializing')
  
  const { isAuthenticated, loading, initialized } = useAuthContext()
  const router = useRouter()

  console.log('🔐 ProtectedRoute Auth State:', { 
    isAuthenticated, 
    loading, 
    initialized 
  })

  useEffect(() => {
    console.log('🔐 ProtectedRoute: useEffect triggered', { initialized, loading, isAuthenticated })
    if (initialized && !loading && !isAuthenticated) {
      console.log('🔐 ProtectedRoute: Redirecting to login')
      router.push('/login')
    }
  }, [isAuthenticated, loading, initialized, router])

  // Show loading while checking auth status
  if (!initialized || loading) {
    console.log('🔐 ProtectedRoute: Showing loading state')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show fallback or redirect to login
  if (!isAuthenticated) {
    console.log('🔐 ProtectedRoute: Not authenticated, showing fallback')
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">Please sign in to access this page.</p>
        </div>
      </div>
    )
  }

  console.log('🔐 ProtectedRoute: Authenticated, rendering children')
  return <>{children}</>
} 