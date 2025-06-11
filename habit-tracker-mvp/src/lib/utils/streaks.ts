import { HabitCompletion } from '@/lib/types/habit'
import { formatDateString } from './date'

/**
 * Calculate the current overall streak across all habits
 * For now, this is a simplified calculation - can be enhanced later with more sophisticated logic
 */
export function calculateOverallStreak(): number {
  // For Phase 1, return a placeholder value
  // This will be properly implemented when we add analytics API
  return 0
}

/**
 * Calculate streak for a specific habit based on its completions
 */
export function calculateHabitStreak(completions: HabitCompletion[]): number {
  if (!completions || completions.length === 0) return 0
  
  // Sort completions by date (most recent first)
  const sortedCompletions = [...completions].sort((a, b) => 
    new Date(b.completion_date).getTime() - new Date(a.completion_date).getTime()
  )
  
  let streak = 0
  const today = new Date()
  const currentDate = new Date(today)
  
  // Check consecutive days backwards from today
  for (let i = 0; i < 30; i++) { // Check last 30 days max
    const dateString = formatDateString(currentDate)
    const hasCompletion = sortedCompletions.some(c => c.completion_date === dateString)
    
    if (hasCompletion) {
      streak++
    } else if (i > 0) {
      // If we miss a day (and it's not today), break the streak
      break
    }
    
    // Move to previous day
    currentDate.setDate(currentDate.getDate() - 1)
  }
  
  return streak
}

/**
 * Get streak days for this week (0-7)
 */
export function getWeeklyStreakDays(): number {
  // Placeholder for now - will be implemented with real data
  return 0
} 