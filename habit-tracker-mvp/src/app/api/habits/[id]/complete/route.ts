import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/habits/[id]/complete - Toggle habit completion for today
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const habitId = params.id
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

    // Verify the habit belongs to the user
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('id, user_id')
      .eq('id', habitId)
      .eq('user_id', user.id)
      .single()

    if (habitError || !habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    // Check if habit is already completed for today
    const { data: existingCompletion, error: checkError } = await supabase
      .from('habit_completions')
      .select('id')
      .eq('habit_id', habitId)
      .eq('completion_date', today)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking completion:', checkError)
      return NextResponse.json({ error: 'Failed to check completion status' }, { status: 500 })
    }

    let isCompleted = false
    let completionData = null

    if (existingCompletion) {
      // Remove completion (toggle off)
      const { error: deleteError } = await supabase
        .from('habit_completions')
        .delete()
        .eq('id', existingCompletion.id)

      if (deleteError) {
        console.error('Error removing completion:', deleteError)
        return NextResponse.json({ error: 'Failed to remove completion' }, { status: 500 })
      }

      isCompleted = false
    } else {
      // Add completion (toggle on)
      const { data: newCompletion, error: insertError } = await supabase
        .from('habit_completions')
        .insert([{
          habit_id: habitId,
          user_id: user.id,
          completion_date: today,
          quantity: 1
        }])
        .select()
        .single()

      if (insertError) {
        console.error('Error adding completion:', insertError)
        return NextResponse.json({ error: 'Failed to add completion' }, { status: 500 })
      }

      isCompleted = true
      completionData = newCompletion
    }

    return NextResponse.json({
      success: true,
      isCompleted,
      completion: completionData,
      date: today
    })

  } catch (error) {
    console.error('Unexpected error in POST /api/habits/[id]/complete:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 