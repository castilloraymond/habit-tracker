'use client'

import Link from 'next/link'
import { useEffect, useMemo } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { CircularProgress } from '@/components/ui/CircularProgress'
import { HabitItem } from '@/components/habits/HabitItem'
import { useHabitStore } from '@/lib/stores/habitStore'

export default function Dashboard() {
  const { habits, loading, fetchHabits, toggleHabitCompletion } = useHabitStore()

  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  // Calculate today's date
  const todayDate = useMemo(() => {
    const today = new Date()
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    const monthName = monthNames[today.getMonth()] || 'January'
    const monthShort = monthName.substring(0, 3)
    return `Today, ${monthShort} ${today.getDate()}`
  }, [])

  // Calculate completion stats
  const completionStats = useMemo(() => {
    const totalHabits = habits.length
    const completedHabits = habits.filter(habit => habit.isCompletedToday).length
    return { completed: completedHabits, total: totalHabits }
  }, [habits])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          {/* Header with date */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{todayDate}</h1>
            <p className="text-gray-600">Let's build great habits together</p>
          </div>

          {/* Motivational Progress Visual */}
          <div className="flex justify-center mb-8">
            <CircularProgress
              completed={completionStats.completed}
              total={completionStats.total}
              size={140}
              strokeWidth={10}
            />
          </div>

          {/* Today's Habit List */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Today's Habits</h2>
              <Link
                href="/manage-habits"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
              >
                Manage Habits
              </Link>
            </div>

            {loading && habits.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading habits...</div>
              </div>
            ) : habits.length === 0 ? (
              <Card className="p-8 text-center">
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
                <Link
                  href="/manage-habits"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors inline-block"
                >
                  Create Your First Habit
                </Link>
              </Card>
            ) : (
              <div className="space-y-3">
                {habits.map((habit) => (
                  <HabitItem
                    key={habit.id}
                    habit={habit}
                    onToggleCompletion={toggleHabitCompletion}
                    disabled={loading}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-center">
                  <Link
                    href="/analytics"
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-md transition-colors"
                  >
                    View Analytics
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
