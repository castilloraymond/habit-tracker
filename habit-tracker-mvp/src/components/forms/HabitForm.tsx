import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { HABIT_CATEGORIES } from '@/lib/constants/habits'
import { DEFAULT_HABIT_COLORS } from '@/lib/constants/colors'
import { validateHabitForm } from '@/lib/utils/validation'
import type { CreateHabitData } from '@/lib/types/habit'
import type { HabitFrequency } from '@/lib/utils/frequency'

interface HabitFormProps {
  onSubmit: (data: CreateHabitData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function HabitForm({ onSubmit, onCancel, isSubmitting = false }: HabitFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: DEFAULT_HABIT_COLORS[0],
    category: 'other' as const,
    targetFrequency: 1,
  })
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const validation = validateHabitForm({
      title: formData.title,
      description: formData.description,
      targetFrequency: formData.targetFrequency,
      color: formData.color,
    })
    
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    
    setErrors([])
    
    const habitData: CreateHabitData = {
      name: formData.title,
      description: formData.description,
      color: formData.color,
      category: formData.category,
      frequency_type: 'daily' as HabitFrequency,
      target_count: formData.targetFrequency,
    }
    
    onSubmit(habitData)
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors.length > 0) {
      setErrors([])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="pb-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Create New Habit</h2>
        <p className="text-sm text-gray-600">Build a new healthy routine to track daily.</p>
      </div>
      
      {errors.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Habit Name"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="e.g., Read for 30 minutes"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Add any additional details about your habit..."
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 text-sm transition-colors duration-200 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200 bg-white"
          >
            {HABIT_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_HABIT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleInputChange('color', color)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                  formData.color === color 
                    ? 'border-gray-800 scale-110' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
                title={`Select ${color}`}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Frequency (times per day)
          </label>
          <select
            value={formData.targetFrequency}
            onChange={(e) => handleInputChange('targetFrequency', parseInt(e.target.value))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200 bg-white"
          >
            {[1, 2, 3, 4, 5].map((freq) => (
              <option key={freq} value={freq}>
                {freq} time{freq > 1 ? 's' : ''} per day
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Creating...' : 'Create Habit'}
        </Button>
      </div>
    </form>
  )
} 