import { useState } from 'react'
import type { Habit } from '@/lib/types/habit'
import { HABIT_CATEGORIES } from '@/lib/constants/habits'

interface HabitItemProps {
  habit: Habit
  onToggleCompletion: (habitId: string) => Promise<void>
  onEdit?: (habit: Habit) => void
  disabled?: boolean
  showStreak?: boolean
  streakDays?: number
}

export function HabitItem({ 
  habit, 
  onToggleCompletion, 
  onEdit, 
  disabled = false,
  showStreak = false,
  streakDays = 0
}: HabitItemProps) {
  const [isToggling, setIsToggling] = useState(false)

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (disabled || isToggling) return

    setIsToggling(true)
    try {
      await onToggleCompletion(habit.id)
    } catch (error) {
      console.error('Failed to toggle habit completion:', error)
    } finally {
      setIsToggling(false)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit(habit)
    }
  }

  const isCompleted = habit.isCompletedToday || false
  
  // Get category emoji
  const categoryInfo = HABIT_CATEGORIES.find(cat => cat.id === habit.category)
  const categoryEmoji = categoryInfo?.icon || '📝'

  return (
    <div className={`
      bg-white rounded-lg p-4 flex items-center justify-between transition-all duration-200
      ${isCompleted ? 'opacity-60' : 'opacity-100'}
      ${disabled || isToggling ? 'cursor-not-allowed' : ''}
    `}>
      {/* Left side: Emoji + Content */}
      <div className="flex items-center gap-3 flex-1">
        {/* Category Emoji */}
        <div className="text-2xl flex-shrink-0">
          {categoryEmoji}
        </div>
        
        {/* Habit info */}
        <div className="flex-1">
          <h3 className={`
            font-medium text-gray-900 transition-all duration-200
            ${isCompleted ? 'line-through text-gray-500' : ''}
          `}>
            {habit.name}
          </h3>
          {showStreak && (
            <p className="text-sm text-gray-500 mt-1">
              {streakDays}-day streak this week
            </p>
          )}
        </div>
      </div>

      {/* Right side: Edit + Completion toggle */}
      <div className="flex items-center gap-3">
        {/* Edit button */}
        {onEdit && (
          <button
            onClick={handleEdit}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
            title="Edit habit"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        )}

        {/* Completion toggle */}
        <button
          onClick={handleToggle}
          disabled={disabled || isToggling}
          className={`
            flex-shrink-0 transition-all duration-200
            ${isToggling ? 'scale-75 opacity-50' : ''}
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {isCompleted ? (
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full border-2 border-gray-300 transition-colors duration-200 hover:border-gray-400" />
          )}
        </button>
      </div>
    </div>
  )
} 