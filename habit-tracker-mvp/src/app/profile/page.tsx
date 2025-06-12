'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/lib/stores/authStore'
import { useHabitStore } from '@/lib/stores/habitStore'
import { useState, useEffect } from 'react'

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore()
  const { habits, fetchHabits } = useHabitStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      })
    }
  }, [user])

  // Calculate stats
  const totalHabits = habits.length
  const totalCompletions = habits.filter(habit => habit.isCompletedToday).length
  const activeHabits = habits.filter(habit => habit.is_active).length

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await updateProfile({ name: formData.name })
      setIsEditing(false)
      // Show success message
      const successDiv = document.createElement('div')
      successDiv.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50'
      successDiv.textContent = 'Profile updated successfully!'
      document.body.appendChild(successDiv)
      setTimeout(() => {
        document.body.removeChild(successDiv)
      }, 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      // Show error message
      const errorDiv = document.createElement('div')
      errorDiv.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50'
      errorDiv.textContent = 'Failed to update profile. Please try again.'
      document.body.appendChild(errorDiv)
      setTimeout(() => {
        document.body.removeChild(errorDiv)
      }, 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    })
    setIsEditing(false)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account information</p>
          </div>
          
          {/* Cards Container */}
          <div className="space-y-6">
            {/* Personal Information Card */}
            <Card 
              className="w-full max-w-2xl mx-auto" 
              style={{ maxWidth: '42rem', minWidth: '30rem' }}
            >
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={true} // Email typically shouldn't be editable
                    placeholder="Your email address"
                  />
                  
                  <div className="flex gap-3 pt-4">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSave} disabled={isLoading}>
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Statistics Card */}
            <Card 
              className="w-full max-w-2xl mx-auto" 
              style={{ maxWidth: '42rem', minWidth: '30rem' }}
            >
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{totalHabits}</p>
                    <p className="text-sm text-gray-600">Total Habits</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{activeHabits}</p>
                    <p className="text-sm text-gray-600">Active Habits</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{totalCompletions}</p>
                    <p className="text-sm text-gray-600">Today's Completions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 