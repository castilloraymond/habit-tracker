// Date utility functions for habit tracking

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]!
}

/**
 * Format a date to YYYY-MM-DD string
 */
export function formatDateString(date: Date): string {
  return date.toISOString().split('T')[0]!
}

/**
 * Parse a YYYY-MM-DD string to Date object
 */
export function parseDateString(dateString: string): Date {
  return new Date(dateString + 'T00:00:00.000Z')
}

/**
 * Get the start of the week (Monday) for a given date
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is Sunday
  return new Date(d.setDate(diff))
}

/**
 * Get the end of the week (Sunday) for a given date
 */
export function getWeekEnd(date: Date = new Date()): Date {
  const weekStart = getWeekStart(date)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  return weekEnd
}

/**
 * Get the start of the month for a given date
 */
export function getMonthStart(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

/**
 * Get the end of the month for a given date
 */
export function getMonthEnd(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

/**
 * Get an array of dates between start and end (inclusive)
 */
export function getDateRange(start: Date, end: Date): Date[] {
  const dates: Date[] = []
  const currentDate = new Date(start)
  
  while (currentDate <= end) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return dates
}

/**
 * Get the number of days between two dates
 */
export function getDaysBetween(start: Date, end: Date): number {
  const timeDiff = end.getTime() - start.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDateString(date1) === formatDateString(date2)
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

/**
 * Check if a date is yesterday
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(date, yesterday)
}

/**
 * Get a human-readable relative date string
 */
export function getRelativeDateString(date: Date): string {
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  
  const daysDiff = getDaysBetween(date, new Date())
  
  if (daysDiff === -1) return 'Tomorrow'
  if (daysDiff < -1 && daysDiff > -7) return `In ${Math.abs(daysDiff)} days`
  if (daysDiff > 0 && daysDiff < 7) return `${daysDiff} days ago`
  
  return date.toLocaleDateString()
}

/**
 * Get the week number of the year for a given date
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

/**
 * Get an array of the last N days (including today)
 */
export function getLastNDays(n: number): Date[] {
  const dates: Date[] = []
  const today = new Date()
  
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.push(date)
  }
  
  return dates
}

/**
 * Format date for display (e.g., "Jan 15, 2024")
 */
export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format date for display with day name (e.g., "Mon, Jan 15")
 */
export function formatDisplayDateWithDay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
} 