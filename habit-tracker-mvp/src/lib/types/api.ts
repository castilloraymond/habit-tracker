// API-related type definitions

export interface ApiResponse<T = unknown> {
  data: T | null
  error: string | null
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  code: string
  status: number
  details?: Record<string, unknown>
}

// Habit API types
export interface CreateHabitRequest {
  title: string
  description?: string
  color?: string
  category?: string
  target_frequency?: number
}

export interface UpdateHabitRequest {
  title?: string
  description?: string
  color?: string
  category?: string
  target_frequency?: number
  is_active?: boolean
}

export interface HabitsResponse extends ApiResponse {
  data: import('./habit').Habit[]
}

export interface HabitResponse extends ApiResponse {
  data: import('./habit').Habit
}

// Completion API types
export interface CreateCompletionRequest {
  habit_id: string
  completed_date?: string // defaults to today
  completed_count?: number // defaults to 1
}

export interface CompletionsResponse extends ApiResponse {
  data: import('./habit').HabitCompletion[]
}

export interface CompletionResponse extends ApiResponse {
  data: import('./habit').HabitCompletion
}

// Analytics API types
export interface AnalyticsRequest {
  start_date?: string
  end_date?: string
  habit_ids?: string[]
}

export interface AnalyticsResponse extends ApiResponse {
  data: {
    habits: import('./habit').HabitWithStats[]
    overall_stats: {
      total_habits: number
      active_habits: number
      completion_rate: number
      current_streak: number
    }
    daily_completions: Array<{
      date: string
      completions: number
      target: number
    }>
  }
}

// Auth API types
export interface SignUpRequest {
  email: string
  password: string
  full_name?: string
}

export interface SignInRequest {
  email: string
  password: string
}

export interface AuthResponse extends ApiResponse {
  data: {
    user: import('./user').User
    session: import('./user').Session
  }
}

export interface ProfileResponse extends ApiResponse {
  data: import('./user').Profile
}

// Generic request/response helpers
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface RequestConfig {
  method: HttpMethod
  headers?: Record<string, string>
  body?: unknown
  params?: Record<string, string>
}

export interface ValidationError {
  field: string
  message: string
  code: string
} 