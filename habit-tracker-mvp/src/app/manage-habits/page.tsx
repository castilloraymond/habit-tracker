'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Modal, ModalContent } from '@/components/ui/Modal'
import { HabitForm } from '@/components/forms/HabitForm'
import { EditHabitForm } from '@/components/forms/EditHabitForm'
import { useState, useEffect } from 'react'
import { useHabitStore } from '@/lib/stores/habitStore'
import { HABIT_CATEGORIES } from '@/lib/constants/habits'
import type { CreateHabitData, Habit } from '@/lib/types/habit'

export default function ManageHabitsPage() {
  const { habits, loading, error, fetchHabits, createHabit, updateHabit, clearError } = useHabitStore()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch habits on component mount
  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  const handleCreateHabit = async (habitData: CreateHabitData) => {
    setIsSubmitting(true)
    try {
      await createHabit(habitData)
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error creating habit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit)
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = async (habitData: CreateHabitData) => {
    if (!editingHabit) return
    
    setIsSubmitting(true)
    try {
      await updateHabit(editingHabit.id, habitData)
      setIsEditModalOpen(false)
      setEditingHabit(null)
    } catch (error) {
      console.error('Error editing habit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenCreateModal = () => {
    clearError()
    setIsCreateModalOpen(true)
  }

  const handleCloseCreateModal = () => {
    if (!isSubmitting) {
      setIsCreateModalOpen(false)
      clearError()
    }
  }

  const handleCloseEditModal = () => {
    if (!isSubmitting) {
      setIsEditModalOpen(false)
      setEditingHabit(null)
      clearError()
    }
  }

  // Get category emoji for a habit
  const getCategoryEmoji = (categoryId: string | undefined) => {
    const category = HABIT_CATEGORIES.find(cat => cat.id === categoryId)
    return category?.icon || '📝'
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header 
          showBackButton={true}
          backHref="/"
          title="Manage All Habits"
          subtitle="Create, edit, and organize your habits"
          actions={
            <Button onClick={handleOpenCreateModal} disabled={loading}>
              + Add New Habit
            </Button>
          }
        />
        
        <div className="container mx-auto py-8 px-4">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
              <Button 
                onClick={clearError} 
                className="mt-2 text-xs bg-red-100 text-red-800 hover:bg-red-200"
              >
                Dismiss
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading && habits.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500">Loading habits...</div>
            </div>
          )}

          {/* Habits List */}
          {!loading && habits.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Habits Yet</h3>
                <p className="text-gray-600 mb-4">
                  Start building better habits today! Create your first habit to begin tracking your progress.
                </p>
                <Button className="w-full" onClick={handleOpenCreateModal}>
                  Create Your First Habit
                </Button>
              </div>
            </div>
          ) : (
            /* Simple List Layout */
            <div className="bg-white rounded-lg shadow-sm">
              {habits.map((habit, index) => (
                <div 
                  key={habit.id} 
                  className={`
                    flex items-center justify-between p-4 hover:bg-gray-50 transition-colors
                    ${index !== habits.length - 1 ? 'border-b border-gray-100' : ''}
                  `}
                >
                  {/* Left side: Emoji + Habit Info */}
                  <div className="flex items-center gap-4 flex-1">
                    {/* Category Emoji */}
                    <div className="text-2xl flex-shrink-0">
                      {getCategoryEmoji(habit.category)}
                    </div>
                    
                    {/* Habit Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {habit.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="capitalize">{habit.frequency_type || 'Daily'}</span>
                        <span>•</span>
                        <span className="capitalize">{habit.category || 'Other'}</span>
                        {habit.isCompletedToday && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">✓ Completed today</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right side: Edit Button */}
                  <button
                    onClick={() => handleEditHabit(habit)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50"
                    title="Edit habit"
                  >
                    <svg
                      className="w-5 h-5"
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Habit Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal}>
        <ModalContent>
          <HabitForm
            onSubmit={handleCreateHabit}
            onCancel={handleCloseCreateModal}
            isSubmitting={isSubmitting}
          />
        </ModalContent>
      </Modal>

      {/* Edit Habit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
        <ModalContent>
          {editingHabit && (
            <EditHabitForm
              habit={editingHabit}
              onSubmit={handleEditSubmit}
              onCancel={handleCloseEditModal}
              isSubmitting={isSubmitting}
            />
          )}
        </ModalContent>
      </Modal>
    </ProtectedRoute>
  )
} 