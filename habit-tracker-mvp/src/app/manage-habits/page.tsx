'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal, ModalContent } from '@/components/ui/Modal'
import { HabitForm } from '@/components/forms/HabitForm'
import { EditHabitForm } from '@/components/forms/EditHabitForm'
import { useState, useEffect } from 'react'
import { useHabitStore } from '@/lib/stores/habitStore'
import type { CreateHabitData, Habit } from '@/lib/types/habit'
import Link from 'next/link'

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
      console.log('Habit created successfully!')
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
      console.log('Habit updated successfully!')
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
        <div className="container mx-auto py-8 px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage All Habits</h1>
                <p className="text-gray-600 mt-2">Create, edit, and organize your habits</p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/"
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md transition-colors"
                >
                  ← Back to Dashboard
                </Link>
                <Button onClick={handleOpenCreateModal} disabled={loading}>
                  + Add New Habit
                </Button>
              </div>
            </div>
          </div>

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
              <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>No Habits Yet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
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
                    <p className="text-gray-600">
                      Start building better habits today! Create your first habit to begin tracking your progress.
                    </p>
                    <Button className="w-full" onClick={handleOpenCreateModal}>
                      Create Your First Habit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {habits.map((habit) => (
                <Card key={habit.id} className="relative">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: habit.color }}
                        />
                        {habit.name}
                      </div>
                      <button
                        onClick={() => handleEditHabit(habit)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
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
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-3">{habit.description || 'No description'}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span className="capitalize">{habit.category || 'Other'}</span>
                      <span className="capitalize">{habit.frequency_type || 'Daily'}</span>
                    </div>
                    {habit.isCompletedToday && (
                      <div className="mt-3 text-xs text-green-600 font-medium">
                        ✓ Completed today
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Habit Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal}>
        <ModalContent className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
              {error}
            </div>
          )}
          <HabitForm
            onSubmit={handleCreateHabit}
            onCancel={handleCloseCreateModal}
            isSubmitting={isSubmitting}
          />
        </ModalContent>
      </Modal>

      {/* Edit Habit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
        <ModalContent className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
              {error}
            </div>
          )}
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