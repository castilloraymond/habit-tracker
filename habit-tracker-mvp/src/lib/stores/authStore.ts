import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthUser, authService } from '../supabase/auth'

interface AuthState {
  user: AuthUser | null
  loading: boolean
  initialized: boolean
  initializing: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  initialize: () => Promise<void>
  setUser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      initialized: false,
      initializing: false,

      signIn: async (email: string, password: string) => {
        set({ loading: true })
        try {
          const { user } = await authService.signIn({ email, password })
          if (user) {
            set({ 
              user: {
                id: user.id,
                email: user.email!,
                name: user.user_metadata?.full_name || '',
                avatar_url: user.user_metadata?.avatar_url || '',
              }
            })
          }
        } catch (error) {
          console.error('Sign in error:', error)
          throw error
        } finally {
          set({ loading: false })
        }
      },

      signUp: async (email: string, password: string, name?: string) => {
        set({ loading: true })
        try {
          await authService.signUp({ email, password, ...(name && { name }) })
          // User will be set via auth state change
        } catch (error) {
          console.error('Sign up error:', error)
          throw error
        } finally {
          set({ loading: false })
        }
      },

      signOut: async () => {
        set({ loading: true })
        try {
          await authService.signOut()
          set({ user: null })
        } catch (error) {
          console.error('Sign out error:', error)
          throw error
        } finally {
          set({ loading: false })
        }
      },

      updateProfile: async (updates: Partial<AuthUser>) => {
        set({ loading: true })
        try {
          await authService.updateProfile(updates)
          set({ user: { ...get().user, ...updates } as AuthUser })
        } catch (error) {
          console.error('Update profile error:', error)
          throw error
        } finally {
          set({ loading: false })
        }
      },

      resetPassword: async (email: string) => {
        set({ loading: true })
        try {
          await authService.resetPassword(email)
        } catch (error) {
          console.error('Reset password error:', error)
          throw error
        } finally {
          set({ loading: false })
        }
      },

      initialize: async () => {
        const state = get()
        
        if (state.initialized || state.initializing) {
          return
        }
        
        set({ loading: true, initializing: true })
        try {
          const user = await authService.getCurrentUser()
          set({ user, initialized: true })

          authService.onAuthStateChange((user) => {
            set({ user })
          })
        } catch (error) {
          console.error('Auth initialization error:', error)
          set({ user: null, initialized: true })
        } finally {
          set({ loading: false, initializing: false })
        }
      },

      setUser: (user: AuthUser | null) => set({ user }),
      setLoading: (loading: boolean) => set({ loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
) 