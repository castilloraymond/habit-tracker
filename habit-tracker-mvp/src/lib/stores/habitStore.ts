import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Habit, CreateHabitData } from '@/lib/types/habit'

interface HabitState {
  habits: Habit[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchHabits: () => Promise<void>
  createHabit: (habitData: CreateHabitData) => Promise<void>
  updateHabit: (habitId: string, habitData: CreateHabitData) => Promise<void>
  toggleHabitCompletion: (habitId: string) => Promise<void>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      loading: false,
      error: null,

      fetchHabits: async () => {
        set({ loading: true, error: null })
        
        try {
          const response = await fetch('/api/habits', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error(`Failed to fetch habits: ${response.statusText}`)
          }

          const result = await response.json()
          
          if (result.error) {
            throw new Error(result.error)
          }

          set({ habits: result.data || [], loading: false })
        } catch (error) {
          console.error('Error fetching habits:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch habits',
            loading: false 
          })
        }
      },

      createHabit: async (habitData: CreateHabitData) => {
        set({ loading: true, error: null })
        
        try {
          const response = await fetch('/api/habits', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(habitData),
          })

          if (!response.ok) {
            throw new Error(`Failed to create habit: ${response.statusText}`)
          }

          const result = await response.json()
          
          if (result.error) {
            throw new Error(result.error)
          }

          // Add the new habit to the current habits list
          set((state) => ({
            habits: [result.data, ...state.habits],
            loading: false
          }))
        } catch (error) {
          console.error('Error creating habit:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create habit',
            loading: false 
          })
          throw error // Re-throw so the component can handle it
        }
      },

      updateHabit: async (habitId: string, habitData: CreateHabitData) => {
        set({ loading: true, error: null })
        
        try {
          const response = await fetch(`/api/habits/${habitId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(habitData),
          })

          if (!response.ok) {
            throw new Error(`Failed to update habit: ${response.statusText}`)
          }

          const result = await response.json()
          
          if (result.error) {
            throw new Error(result.error)
          }

          // Update the habit in the store
          set((state) => ({
            habits: state.habits.map(habit => 
              habit.id === habitId ? { ...habit, ...result.data } : habit
            ),
            loading: false
          }))
        } catch (error) {
          console.error('Error updating habit:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update habit',
            loading: false 
          })
          throw error
        }
      },

      toggleHabitCompletion: async (habitId: string) => {
        console.log('🔄 Starting toggleHabitCompletion for habit:', habitId)
        try {
          const response = await fetch(`/api/habits/${habitId}/complete`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          console.log('📡 API Response status:', response.status, response.statusText)

          if (!response.ok) {
            const errorText = await response.text()
            console.error('❌ API Error Response:', errorText)
            throw new Error(`Failed to toggle completion: ${response.statusText}`)
          }

          const result = await response.json()
          console.log('📦 API Result:', result)
          
          if (result.error) {
            console.error('❌ API returned error:', result.error)
            throw new Error(result.error)
          }

          // Update the habit completion status in the store
          set((state) => {
            console.log('🔄 Updating habit state. Before:', 
              state.habits.find(h => h.id === habitId)?.isCompletedToday
            )
            
            const updatedHabits = state.habits.map(habit => 
              habit.id === habitId 
                ? { 
                    ...habit, 
                    isCompletedToday: result.isCompleted,
                    completionData: result.completion 
                  }
                : habit
            )
            
            console.log('✅ Updated habit state. After:', 
              updatedHabits.find(h => h.id === habitId)?.isCompletedToday
            )
            
            return { habits: updatedHabits }
          })

          console.log('🎉 Toggle completion successful!')
        } catch (error) {
          console.error('💥 Error toggling habit completion:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Failed to toggle completion'
          })
          throw error
        }
      },

      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'habit-store',
      // Only persist habits, not loading/error states
      partialize: (state) => ({ habits: state.habits }),
    }
  )
) 