'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal, ModalContent } from '@/components/ui/Modal'
import { HabitForm } from '@/components/forms/HabitForm'
import { useState } from 'react'
import type { CreateHabitData } from '@/lib/types/habit'

export default function HabitsPage() {
  const [habits] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateHabit = async (habitData: CreateHabitData) => {
    setIsSubmitting(true)
    try {
      // TODO: Implement API call to create habit
      console.log('Creating habit:', habitData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Close modal on success
      setIsModalOpen(false)
      
      // TODO: Refresh habits list or add to local state
      alert('Habit created successfully!')
    } catch (error) {
      console.error('Error creating habit:', error)
      alert('Failed to create habit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    if (!isSubmitting) { // Prevent closing while submitting
      setIsModalOpen(false)
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
            <Button onClick={handleOpenModal}>
              + Add New Habit
            </Button>
          </div>

          {habits.length === 0 ? (
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
              {/* Habits will be displayed here when implemented */}
              {habits.map((habit: any) => (
                <Card key={habit.id}>
                  <CardHeader>
                    <CardTitle>{habit.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{habit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Habit Creation Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalContent className="max-w-lg">
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