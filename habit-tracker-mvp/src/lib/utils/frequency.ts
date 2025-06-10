export type HabitFrequency = 'daily' | 'weekly' | 'custom'

export interface CustomFrequency {
  type: 'days' | 'weeks'
  interval: number
  specificDays?: number[] // Array of weekday numbers (0=Sunday, 6=Saturday)
}

export interface FrequencyConfig {
  type: HabitFrequency
  custom?: CustomFrequency
  targetCount?: number
}

/**
 * Check if a habit should be completed today based on its frequency
 */
export function shouldCompleteToday(
  frequency: FrequencyConfig,
  habitCreatedAt: Date,
  today: Date = new Date()
): boolean {
  const todayDay = today.getDay() // 0 = Sunday, 6 = Saturday

  switch (frequency.type) {
    case 'daily':
      return true

    case 'weekly':
      // For weekly habits, we can complete them any day of the week
      return true

    case 'custom':
      if (!frequency.custom) return false

      const { type, interval, specificDays } = frequency.custom

      if (specificDays && specificDays.length > 0) {
        // Specific days of the week
        return specificDays.includes(todayDay)
      }

      if (type === 'days') {
        // Every N days since creation
        const daysSinceCreation = Math.floor(
          (today.getTime() - habitCreatedAt.getTime()) / (1000 * 60 * 60 * 24)
        )
        return daysSinceCreation % interval === 0
      }

      if (type === 'weeks') {
        // Every N weeks since creation
        const weeksSinceCreation = Math.floor(
          (today.getTime() - habitCreatedAt.getTime()) / (1000 * 60 * 60 * 24 * 7)
        )
        return weeksSinceCreation % interval === 0
      }

      return false

    default:
      return false
  }
}

/**
 * Get the next due date for a habit based on its frequency
 */
export function getNextDueDate(
  frequency: FrequencyConfig,
  habitCreatedAt: Date,
  lastCompletedAt?: Date
): Date {
  const today = new Date()
  
  switch (frequency.type) {
    case 'daily':
      return new Date(today.getTime() + 24 * 60 * 60 * 1000) // Tomorrow

    case 'weekly':
      return new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) // Next week

    case 'custom':
      if (!frequency.custom) return today

      const { type, interval, specificDays } = frequency.custom

      if (specificDays && specificDays.length > 0) {
        // Find next occurrence of any of the specific days
        const sortedDays = [...specificDays].sort((a, b) => a - b)
        const todayDay = today.getDay()
        
        // Find next day in the current week
        const nextDay = sortedDays.find(day => day > todayDay)
        if (nextDay !== undefined) {
          const daysToAdd = nextDay - todayDay
          return new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
        }
        
        // If no day found this week, get first day of next week
        const firstDay = sortedDays[0] ?? 0
        const daysToAdd = 7 - todayDay + firstDay
        return new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
      }

      if (type === 'days') {
        return new Date(today.getTime() + interval * 24 * 60 * 60 * 1000)
      }

      if (type === 'weeks') {
        return new Date(today.getTime() + interval * 7 * 24 * 60 * 60 * 1000)
      }

      return today

    default:
      return today
  }
}

/**
 * Get all dates when a habit should be completed within a date range
 */
export function getScheduleDates(
  frequency: FrequencyConfig,
  habitCreatedAt: Date,
  startDate: Date,
  endDate: Date
): Date[] {
  const dates: Date[] = []
  const current = new Date(startDate)

  while (current <= endDate) {
    if (shouldCompleteToday(frequency, habitCreatedAt, current)) {
      dates.push(new Date(current))
    }
    current.setDate(current.getDate() + 1)
  }

  return dates
}

/**
 * Calculate frequency-aware progress percentage
 */
export function calculateFrequencyProgress(
  frequency: FrequencyConfig,
  completions: Date[],
  habitCreatedAt: Date,
  periodStart: Date,
  periodEnd: Date
): number {
  const scheduledDates = getScheduleDates(frequency, habitCreatedAt, periodStart, periodEnd)
  const completionDates = completions.map(date => date.toDateString())
  
  if (scheduledDates.length === 0) return 0

  const completedCount = scheduledDates.filter(date =>
    completionDates.includes(date.toDateString())
  ).length

  return Math.round((completedCount / scheduledDates.length) * 100)
}

/**
 * Get a human-readable description of the frequency
 */
export function getFrequencyDescription(frequency: FrequencyConfig): string {
  switch (frequency.type) {
    case 'daily':
      return frequency.targetCount && frequency.targetCount > 1
        ? `${frequency.targetCount} times daily`
        : 'Daily'

    case 'weekly':
      return frequency.targetCount && frequency.targetCount > 1
        ? `${frequency.targetCount} times weekly`
        : 'Weekly'

    case 'custom':
      if (!frequency.custom) return 'Custom'

      const { type, interval, specificDays } = frequency.custom

      if (specificDays && specificDays.length > 0) {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const dayLabels = specificDays.map(day => dayNames[day]).join(', ')
        return `${dayLabels}`
      }

      if (type === 'days') {
        return interval === 1 ? 'Daily' : `Every ${interval} days`
      }

      if (type === 'weeks') {
        return interval === 1 ? 'Weekly' : `Every ${interval} weeks`
      }

      return 'Custom'

    default:
      return 'Unknown'
  }
} 