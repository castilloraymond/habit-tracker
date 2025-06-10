import { createClient } from './client'

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

export interface SignUpData {
  email: string
  password: string
  name?: string
}

export interface SignInData {
  email: string
  password: string
}

export class AuthService {
  private supabase = createClient()

  async signUp({ email, password, name }: SignUpData) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name || '',
        },
      },
    })

    if (error) throw error
    return data
  }

  async signIn({ email, password }: SignInData) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user }, error } = await this.supabase.auth.getUser()
    
    if (error || !user) return null

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name || '',
      avatar_url: user.user_metadata?.avatar_url || '',
    }
  }

  async updateProfile(updates: Partial<AuthUser>) {
    const { data, error } = await this.supabase.auth.updateUser({
      data: {
        full_name: updates.name,
        avatar_url: updates.avatar_url,
      },
    })

    if (error) throw error
    return data
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return this.supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ? {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata?.full_name || '',
        avatar_url: session.user.user_metadata?.avatar_url || '',
      } : null

      callback(user)
    })
  }

  async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) throw error
  }

  async updatePassword(password: string) {
    const { error } = await this.supabase.auth.updateUser({
      password,
    })

    if (error) throw error
  }
}

export const authService = new AuthService() 