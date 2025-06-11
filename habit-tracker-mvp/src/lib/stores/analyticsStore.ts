import { create } from 'zustand'

export interface AnalyticsOverview {
  totalHabits: number
  todayCompletionRate: number
  currentStreak: number
  totalCompletions: number
  weeklyCompletionRate: number
}

export interface AnalyticsBreakdown {
  categories: Record<string, number>
}

export interface AnalyticsData {
  overview: AnalyticsOverview
  breakdown: AnalyticsBreakdown
  heatmap: Record<string, number>
  lastUpdated: string
}

interface AnalyticsStore {
  analytics: AnalyticsData | null
  loading: boolean
  error: string | null
  
  // Actions
  fetchAnalytics: () => Promise<void>
  clearAnalytics: () => void
  clearError: () => void
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  analytics: null,
  loading: false,
  error: null,

  fetchAnalytics: async () => {
    try {
      set({ loading: true, error: null })
      
      console.log('🔄 Fetching analytics data...')
      
      const response = await fetch('/api/analytics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch analytics')
      }

      const result = await response.json()
      
      console.log('📊 Analytics data fetched:', result.data)
      
      set({ 
        analytics: result.data,
        loading: false,
        error: null 
      })
    } catch (error) {
      console.error('❌ Error fetching analytics:', error)
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch analytics' 
      })
    }
  },

  clearAnalytics: () => {
    set({ analytics: null, error: null })
  },

  clearError: () => {
    set({ error: null })
  },
})) 