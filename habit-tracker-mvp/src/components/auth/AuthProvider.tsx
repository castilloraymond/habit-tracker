'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { AuthUser } from '@/lib/supabase/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  initialized: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  console.log('🔑 AuthProvider: Component initializing')
  
  const auth = useAuth()

  console.log('🔑 AuthProvider State from useAuth:', { 
    user: auth.user ? 'USER_EXISTS' : 'NO_USER', 
    loading: auth.loading, 
    initialized: auth.initialized,
    isAuthenticated: auth.isAuthenticated
  })

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
} 