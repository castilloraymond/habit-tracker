import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/analytics - Fetch user's analytics data
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date().toISOString().split('T')[0]
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Get total habits count
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('id, name, category, created_at')
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (habitsError) {
      console.error('Error fetching habits:', habitsError)
      return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 })
    }

    const totalHabits = habits?.length || 0

    // Get today's completions
    const { data: todayCompletions, error: todayError } = await supabase
      .from('habit_completions')
      .select('habit_id')
      .eq('user_id', user.id)
      .eq('completion_date', today)

    if (todayError) {
      console.error('Error fetching today completions:', todayError)
      return NextResponse.json({ error: 'Failed to fetch today completions' }, { status: 500 })
    }

    const todayCompletedCount = todayCompletions?.length || 0
    const todayCompletionRate = totalHabits > 0 ? Math.round((todayCompletedCount / totalHabits) * 100) : 0

    // Get week's completions for streak calculation
    const { data: weekCompletions, error: weekError } = await supabase
      .from('habit_completions')
      .select('completion_date, habit_id')
      .eq('user_id', user.id)
      .gte('completion_date', weekAgo)
      .order('completion_date', { ascending: false })

    if (weekError) {
      console.error('Error fetching week completions:', weekError)
      return NextResponse.json({ error: 'Failed to fetch week completions' }, { status: 500 })
    }

    // Calculate current streak (consecutive days with at least one completion)
    let currentStreak = 0
    const completionsByDate = new Map()
    
    weekCompletions?.forEach(completion => {
      const date = completion.completion_date
      if (!completionsByDate.has(date)) {
        completionsByDate.set(date, new Set())
      }
      completionsByDate.get(date).add(completion.habit_id)
    })

    // Calculate streak backwards from today
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      if (completionsByDate.has(checkDate) && completionsByDate.get(checkDate).size > 0) {
        currentStreak++
      } else if (i > 0) {
        break // Don't count today if no completions, but break streak if missing other days
      }
    }

    // Get total completions count
    const { data: allCompletions, error: allError } = await supabase
      .from('habit_completions')
      .select('id')
      .eq('user_id', user.id)

    if (allError) {
      console.error('Error fetching all completions:', allError)
      return NextResponse.json({ error: 'Failed to fetch all completions' }, { status: 500 })
    }

    const totalCompletions = allCompletions?.length || 0

    // Get week's completion rate
    const { data: weekHabits, error: weekHabitsError } = await supabase
      .from('habit_completions')
      .select('completion_date')
      .eq('user_id', user.id)
      .gte('completion_date', weekAgo)

    if (weekHabitsError) {
      console.error('Error fetching week habits:', weekHabitsError)
      return NextResponse.json({ error: 'Failed to fetch week habits' }, { status: 500 })
    }

    const weekCompletedDays = new Set(weekHabits?.map(h => h.completion_date) || []).size
    const weeklyCompletionRate = Math.round((weekCompletedDays / 7) * 100)

    // Get habit breakdown by category
    const categoryBreakdown = habits?.reduce((acc, habit) => {
      const category = habit.category || 'other'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    // Get recent completion dates for heatmap (last 30 days)
    const { data: recentCompletions, error: recentError } = await supabase
      .from('habit_completions')
      .select('completion_date')
      .eq('user_id', user.id)
      .gte('completion_date', monthAgo)
      .order('completion_date', { ascending: true })

    if (recentError) {
      console.error('Error fetching recent completions:', recentError)
      return NextResponse.json({ error: 'Failed to fetch recent completions' }, { status: 500 })
    }

    // Create heatmap data (completion count per day)
    const heatmapData = recentCompletions?.reduce((acc, completion) => {
      const date = completion.completion_date
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    const analytics = {
      overview: {
        totalHabits,
        todayCompletionRate,
        currentStreak,
        totalCompletions,
        weeklyCompletionRate,
      },
      breakdown: {
        categories: categoryBreakdown,
      },
      heatmap: heatmapData,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({ data: analytics })
  } catch (error) {
    console.error('Unexpected error in GET /api/analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 