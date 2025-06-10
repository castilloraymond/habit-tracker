import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/authStore'

export const useAuth = () => {
  const {
    user,
    loading,
    initialized,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    initialize,
  } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  return {
    user,
    loading,
    initialized,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
  }
} 