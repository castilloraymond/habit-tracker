// Habit-related type definitions

export interface Habit {
  id: string
  user_id: string
  title: string
  description?: string
  color: string
  category?: string
  target_frequency: number // times per day
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface HabitCompletion {
  id: string
  habit_id: string
  user_id: string
  completed_date: string // YYYY-MM-DD format
  completed_count: number
  completed_at: string
}

export interface CreateHabitInput {
  title: string
  description?: string
  color?: string
  category?: string
  target_frequency?: number
}

export interface UpdateHabitInput {
  title?: string
  description?: string
  color?: string
  category?: string
  target_frequency?: number
  is_active?: boolean
}

export interface HabitWithStats extends Habit {
  current_streak: number
  completion_rate: number
  total_completions: number
  is_completed_today: boolean
}

export interface HabitStats {
  habit_id: string
  current_streak: number
  longest_streak: number
  completion_rate: number
  total_completions: number
  completions_this_week: number
  completions_this_month: number
}

export type HabitCategory = 
  | 'health'
  | 'fitness'
  | 'productivity'
  | 'learning'
  | 'social'
  | 'mindfulness'
  | 'creativity'
  | 'other'

export interface DateRange {
  start: string // YYYY-MM-DD
  end: string   // YYYY-MM-DD
} 