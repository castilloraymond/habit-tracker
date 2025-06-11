'use client'

import { useEffect, ReactNode, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from './AuthProvider'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, loading, initialized } = useAuthContext()
  const router = useRouter()
  const redirectingRef = useRef(false)

  useEffect(() => {
    if (initialized && !loading && !isAuthenticated && !redirectingRef.current) {
      console.log('🔐 ProtectedRoute: Redirecting to login')
      redirectingRef.current = true
      router.push('/login')
    }
  }, [isAuthenticated, loading, initialized, router])

  // Show loading while checking auth status
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show fallback or redirect to login
  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">Please sign in to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 