// Habit-related type definitions

import { HabitFrequency, CustomFrequency } from '../utils/frequency'

export interface Habit {
  id: string
  user_id: string
  name: string
  description?: string
  color: string
  category?: string
  frequency_type: HabitFrequency
  frequency_config?: Record<string, any>
  custom_interval_type?: 'days' | 'weeks'
  custom_interval_value?: number
  custom_specific_days?: number[]
  target_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface HabitCompletion {
  id: string
  habit_id: string
  user_id: string
  completed_at: string
  completion_date: string
  notes?: string
  quantity: number
  created_at: string
}

export interface CreateHabitData {
  name: string
  description?: string
  color?: string
  category?: string
  frequency_type: HabitFrequency
  custom_interval_type?: 'days' | 'weeks'
  custom_interval_value?: number
  custom_specific_days?: number[]
  target_count?: number
}

export interface UpdateHabitData extends Partial<CreateHabitData> {
  is_active?: boolean
}

export interface HabitWithCompletions extends Habit {
  completions: HabitCompletion[]
  currentStreak: number
  lastCompleted?: string
  isCompletedToday: boolean
  nextDueDate?: string
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