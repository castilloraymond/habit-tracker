'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { StatsCard } from '@/components/analytics/StatsCard'
import { HeatmapChart } from '@/components/analytics/HeatmapChart'
import { CategoryChart } from '@/components/analytics/CategoryChart'
import { Button } from '@/components/ui/Button'
import { SkeletonCard, PageLoading } from '@/components/ui/Loading'
import { useAnalyticsStore } from '@/lib/stores/analyticsStore'
import { useEffect } from 'react'

export default function AnalyticsPage() {
  const { analytics, loading, error, fetchAnalytics, clearError } = useAnalyticsStore()

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const getStreakIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )

  const getProgressIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )

  const getHabitsIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )

  const getCompletionsIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header 
          showBackButton={true}
          backHref="/"
          title="Analytics"
          subtitle="Track your progress and insights"
          actions={
            <Button onClick={() => fetchAnalytics()} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh Data'}
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
          {loading && !analytics && (
            <div className="space-y-8">
              {/* Loading skeleton for metrics cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
              
              {/* Loading skeleton for charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="lg:col-span-2">
                  <SkeletonCard />
                </div>
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>
          )}

          {/* Analytics Content */}
          {analytics && (
            <div className="space-y-8">
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Habits"
                  value={analytics.overview.totalHabits}
                  subtitle={`${analytics.overview.totalHabits > 0 ? 'Active' : 'Get started!'}`}
                  icon={getHabitsIcon()}
                />
                <StatsCard
                  title="Today's Progress"
                  value={`${analytics.overview.todayCompletionRate}%`}
                  subtitle={
                    analytics.overview.todayCompletionRate >= 80 
                      ? 'Excellent!' 
                      : analytics.overview.todayCompletionRate >= 60 
                      ? 'Good progress' 
                      : 'Keep going!'
                  }
                  trend={
                    analytics.overview.todayCompletionRate >= 80 
                      ? 'up' 
                      : analytics.overview.todayCompletionRate >= 60 
                      ? 'neutral' 
                      : 'down'
                  }
                  icon={getProgressIcon()}
                />
                <StatsCard
                  title="Current Streak"
                  value={`${analytics.overview.currentStreak} day${analytics.overview.currentStreak !== 1 ? 's' : ''}`}
                  subtitle={
                    analytics.overview.currentStreak >= 7 
                      ? 'Amazing streak!' 
                      : analytics.overview.currentStreak >= 3 
                      ? 'Building momentum' 
                      : 'Start your streak!'
                  }
                  trend={analytics.overview.currentStreak >= 3 ? 'up' : 'neutral'}
                  icon={getStreakIcon()}
                />
                <StatsCard
                  title="Total Completions"
                  value={analytics.overview.totalCompletions}
                  subtitle={`${analytics.overview.weeklyCompletionRate}% this week`}
                  icon={getCompletionsIcon()}
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Activity Heatmap */}
                <div className="lg:col-span-2">
                  <HeatmapChart 
                    data={analytics.heatmap} 
                    title="30-Day Activity Heatmap"
                  />
                </div>

                {/* Category Breakdown */}
                <CategoryChart 
                  data={analytics.breakdown.categories}
                  title="Habits by Category"
                />

                {/* Quick Stats */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Weekly Completion Rate</span>
                      <span className="font-medium text-gray-900">
                        {analytics.overview.weeklyCompletionRate}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average per Day</span>
                      <span className="font-medium text-gray-900">
                        {analytics.overview.totalCompletions > 0 
                          ? Math.round(analytics.overview.totalCompletions / Math.max(1, analytics.overview.currentStreak || 1))
                          : 0
                        } completions
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Best Streak</span>
                      <span className="font-medium text-gray-900">
                        {analytics.overview.currentStreak} days
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-sm text-gray-500">Last Updated</span>
                      <span className="text-xs text-gray-400">
                        {new Date(analytics.lastUpdated).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insights Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Insights & Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analytics.overview.currentStreak === 0 && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">💡 Start Your Journey</h4>
                      <p className="text-sm text-blue-800">
                        Complete at least one habit today to start building your streak!
                      </p>
                    </div>
                  )}
                  
                  {analytics.overview.currentStreak >= 7 && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">🎉 Week Streak!</h4>
                      <p className="text-sm text-green-800">
                        Amazing! You've maintained your habits for a full week. Keep it up!
                      </p>
                    </div>
                  )}

                  {analytics.overview.todayCompletionRate >= 100 && (
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">⭐ Perfect Day!</h4>
                      <p className="text-sm text-purple-800">
                        You've completed all your habits today. Excellent work!
                      </p>
                    </div>
                  )}

                  {analytics.overview.totalHabits === 0 && (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-2">🚀 Get Started</h4>
                      <p className="text-sm text-yellow-800">
                        Create your first habit to start tracking your progress and building better routines.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !analytics && !error && (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {getCompletionsIcon()}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Yet</h3>
                <p className="text-gray-600 mb-4">
                  Start tracking habits to see your progress and insights here.
                </p>
                <Button onClick={() => window.location.href = '/'}>
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
} 