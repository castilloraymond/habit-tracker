'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal, ModalContent } from '@/components/ui/Modal'
import { HabitForm } from '@/components/forms/HabitForm'
import { useState, useEffect } from 'react'
import { useHabitStore } from '@/lib/stores/habitStore'
import type { CreateHabitData } from '@/lib/types/habit'

export default function HabitsPage() {
  const { habits, loading, error, fetchHabits, createHabit, clearError } = useHabitStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch habits on component mount
  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  const handleCreateHabit = async (habitData: CreateHabitData) => {
    setIsSubmitting(true)
    try {
      await createHabit(habitData)
      
      // Close modal on success
      setIsModalOpen(false)
      
      // Success message
      console.log('Habit created successfully!')
    } catch (error) {
      console.error('Error creating habit:', error)
      // Error is already handled by the store
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenModal = () => {
    clearError() // Clear any previous errors
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    if (!isSubmitting) { // Prevent closing while submitting
      setIsModalOpen(false)
      clearError() // Clear errors when closing modal
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Habits</h1>
              <p className="text-gray-600 mt-2">Manage and track your daily habits</p>
            </div>
            <Button onClick={handleOpenModal} disabled={loading}>
              + Add New Habit
            </Button>
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

          {!loading && habits.length === 0 ? (
            <div className="text-center py-12">
              <Card className="w-full max-w-md mx-auto" style={{maxWidth: '30rem', minWidth: '30rem'}}>
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
                    <Button className="w-full" onClick={handleOpenModal}>
                      Create Your First Habit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {habits.map((habit) => (
                <Card key={habit.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: habit.color }}
                      />
                      {habit.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-2">{habit.description || 'No description'}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span className="capitalize">{habit.category || 'Other'}</span>
                      <span>{habit.frequency_type || 'daily'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Habit Creation Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalContent className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
              {error}
            </div>
          )}
          <HabitForm
            onSubmit={handleCreateHabit}
            onCancel={handleCloseModal}
            isSubmitting={isSubmitting}
          />
        </ModalContent>
      </Modal>
    </ProtectedRoute>
  )
} 