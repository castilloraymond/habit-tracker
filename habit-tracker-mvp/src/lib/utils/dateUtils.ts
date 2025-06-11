export function formatTodayDate(): string {
  const today = new Date()
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' })
  const monthName = today.toLocaleDateString('en-US', { month: 'long' })
  const dayNumber = today.getDate()
  
  return `${dayName}, ${monthName} ${dayNumber}`
}

export function formatDateShort(): string {
  const today = new Date()
  const monthName = today.toLocaleDateString('en-US', { month: 'short' })
  const dayNumber = today.getDate()
  
  return `Today, ${monthName} ${dayNumber}`
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0] // YYYY-MM-DD format
}

export function isToday(dateString: string): boolean {
  return dateString === getTodayString()
} 