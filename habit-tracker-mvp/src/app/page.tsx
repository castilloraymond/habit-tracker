'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
// Removed unused Card imports - using simplified layout
import { HorizontalProgress } from '@/components/ui/HorizontalProgress'
import { HabitItem } from '@/components/habits/HabitItem'
import { Modal, ModalContent } from '@/components/ui/Modal'
import { HabitForm } from '@/components/forms/HabitForm'
import { EditHabitForm } from '@/components/forms/EditHabitForm'
import { useHabitStore } from '@/lib/stores/habitStore'
import { useAuthStore } from '@/lib/stores/authStore'
import { getWeeklyStreakDays } from '@/lib/utils/streaks'
import type { CreateHabitData, Habit } from '@/lib/types/habit'

export default function Dashboard() {
  const { habits, loading, fetchHabits, toggleHabitCompletion, createHabit, updateHabit, clearError } = useHabitStore()
  const { user } = useAuthStore()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  // Calculate greeting and date
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    let timeGreeting = 'Good Morning'
    if (hour >= 12 && hour < 17) timeGreeting = 'Good Afternoon'
    else if (hour >= 17) timeGreeting = 'Good Evening'
    
    const userName = user?.name || user?.email?.split('@')[0] || 'there'
    return `${timeGreeting}, ${userName}`
  }, [user])

  const todayDate = useMemo(() => {
    const today = new Date()
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return today.toLocaleDateString('en-US', options)
  }, [])

  // Calculate completion stats
  const completionStats = useMemo(() => {
    const totalHabits = habits.length
    const completedHabits = habits.filter(habit => habit.isCompletedToday).length
    return { completed: completedHabits, total: totalHabits }
  }, [habits])

  // Group habits into ongoing and completed
  const { ongoingHabits, completedHabits } = useMemo(() => {
    const ongoing = habits.filter(habit => !habit.isCompletedToday)
    const completed = habits.filter(habit => habit.isCompletedToday)
    return { ongoingHabits: ongoing, completedHabits: completed }
  }, [habits])

  // Get overall streak days (placeholder for now)
  const overallStreakDays = getWeeklyStreakDays()

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header 
          actions={
            <button
              onClick={handleOpenCreateModal}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
            >
              + Add
            </button>
          }
        />
        <div className="container mx-auto py-8 px-4">
          {/* Header with greeting */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{greeting}</h1>
            <p className="text-gray-600 mt-1">{todayDate}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <HorizontalProgress
              completed={completionStats.completed}
              total={completionStats.total}
              className="w-full"
            />
          </div>

          {loading && habits.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading habits...</div>
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center py-12">
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
              <button
                onClick={handleOpenCreateModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
              >
                Create Your First Habit
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Ongoing Habits */}
              {ongoingHabits.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Ongoing
                  </h2>
                  <div className="space-y-3">
                    {ongoingHabits.map((habit) => (
                      <HabitItem
                        key={habit.id}
                        habit={habit}
                        onToggleCompletion={toggleHabitCompletion}
                        onEdit={handleEditHabit}
                        disabled={loading}
                        showStreak={true}
                        streakDays={overallStreakDays}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Habits */}
              {completedHabits.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Completed
                  </h2>
                  <div className="space-y-3">
                    {completedHabits.map((habit) => (
                      <HabitItem
                        key={habit.id}
                        habit={habit}
                        onToggleCompletion={toggleHabitCompletion}
                        onEdit={handleEditHabit}
                        disabled={loading}
                        showStreak={true}
                        streakDays={overallStreakDays}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-12">
            <div className="flex justify-center">
              <Link
                href="/analytics"
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-md transition-colors"
              >
                View Analytics
              </Link>
            </div>
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
      </div>
    </ProtectedRoute>
  )
}
