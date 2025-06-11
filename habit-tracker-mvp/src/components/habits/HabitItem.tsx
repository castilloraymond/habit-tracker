import { useState } from 'react'
import type { Habit } from '@/lib/types/habit'

interface HabitItemProps {
  habit: Habit
  onToggleCompletion: (habitId: string) => Promise<void>
  disabled?: boolean
}

export function HabitItem({ habit, onToggleCompletion, disabled = false }: HabitItemProps) {
  const [isToggling, setIsToggling] = useState(false)

  const handleToggle = async () => {
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

  const isCompleted = habit.isCompletedToday || false

  return (
    <div
      onClick={handleToggle}
      className={`
        bg-white rounded-lg border border-gray-200 p-4 cursor-pointer transition-all duration-200
        ${isCompleted ? 'opacity-75' : 'opacity-100'}
        ${disabled || isToggling ? 'cursor-not-allowed' : 'hover:border-gray-300 hover:shadow-sm'}
        ${isToggling ? 'scale-95' : 'hover:scale-[1.02]'}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Color indicator */}
          <div 
            className="w-4 h-4 rounded-full flex-shrink-0" 
            style={{ backgroundColor: habit.color }}
          />
          
          {/* Habit content */}
          <div className="flex-1">
            <h3 className={`
              font-medium text-gray-900 transition-all duration-200
              ${isCompleted ? 'line-through' : ''}
            `}>
              {habit.name}
            </h3>
            {habit.description && (
              <p className={`
                text-sm text-gray-600 mt-1 transition-all duration-200
                ${isCompleted ? 'line-through' : ''}
              `}>
                {habit.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <span className="capitalize">{habit.category || 'Other'}</span>
              <span>•</span>
              <span className="capitalize">{habit.frequency_type || 'Daily'}</span>
            </div>
          </div>
        </div>

        {/* Completion indicator */}
        <div className={`
          flex-shrink-0 ml-3 transition-all duration-200
          ${isToggling ? 'scale-75 opacity-50' : ''}
        `}>
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
        </div>
      </div>
    </div>
  )
} 