// User and authentication-related type definitions

export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  error: string | null
}

export interface SignUpCredentials {
  email: string
  password: string
  full_name?: string
}

export interface SignInCredentials {
  email: string
  password: string
}

export interface UpdateProfileInput {
  full_name?: string
  avatar_url?: string
}

export interface AuthError {
  message: string
  code?: string
}

export interface Session {
  access_token: string
  refresh_token: string
  expires_at: number
  user: User
}

export type AuthAction = 
  | 'SIGN_IN'
  | 'SIGN_UP' 
  | 'SIGN_OUT'
  | 'UPDATE_PROFILE'
  | 'RESET_PASSWORD' 