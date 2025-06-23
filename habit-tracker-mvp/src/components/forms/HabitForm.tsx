import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { HABIT_CATEGORIES } from '@/lib/constants/habits'
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
    category: 'other' as const,
    frequency: 'daily' as HabitFrequency,
    targetFrequency: 1,
  })
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const validation = validateHabitForm({
      title: formData.title,
      description: formData.description,
      targetFrequency: formData.targetFrequency,
      color: '#3B82F6', // Default blue color
    })
    
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    
    setErrors([])
    
    const habitData: CreateHabitData = {
      name: formData.title,
      description: formData.description,
      color: '#3B82F6', // Default blue color
      category: formData.category,
      frequency_type: formData.frequency,
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
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {errors.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
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
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 text-sm text-gray-900 bg-white transition-colors duration-200 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 transition-colors duration-200 bg-white"
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
              Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => handleInputChange('frequency', e.target.value as HabitFrequency)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 transition-colors duration-200 bg-white"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
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