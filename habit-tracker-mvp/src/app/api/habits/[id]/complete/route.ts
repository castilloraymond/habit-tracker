import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/habits/[id]/complete - Toggle habit completion for today
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔄 Toggle completion request for habit:', params.id)
    
    const supabase = await createClient()
    console.log('✅ Supabase client created')
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('🔐 Auth check:', { user: user?.id, error: authError?.message })
    
    if (authError || !user) {
      console.error('❌ Authentication failed:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const habitId = params.id
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    console.log('📅 Today:', today, 'Habit ID:', habitId)

    // Verify the habit belongs to the user
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('id, user_id')
      .eq('id', habitId)
      .eq('user_id', user.id)
      .single()

    console.log('🔍 Habit lookup:', { habit: habit?.id, error: habitError?.message })

    if (habitError || !habit) {
      console.error('❌ Habit not found:', habitError)
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    // Check if habit is already completed for today
    const { data: existingCompletion, error: checkError } = await supabase
      .from('habit_completions')
      .select('id')
      .eq('habit_id', habitId)
      .eq('completion_date', today)
      .single()

    console.log('📊 Existing completion:', { 
      exists: !!existingCompletion, 
      completionId: existingCompletion?.id,
      error: checkError?.message 
    })

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('❌ Error checking completion:', checkError)
      return NextResponse.json({ error: 'Failed to check completion status' }, { status: 500 })
    }

    let isCompleted = false
    let completionData = null

    if (existingCompletion) {
      // Remove completion (toggle off)
      console.log('🗑️ Removing existing completion')
      const { error: deleteError } = await supabase
        .from('habit_completions')
        .delete()
        .eq('id', existingCompletion.id)

      if (deleteError) {
        console.error('❌ Error removing completion:', deleteError)
        return NextResponse.json({ error: 'Failed to remove completion' }, { status: 500 })
      }

      isCompleted = false
      console.log('✅ Completion removed successfully')
    } else {
      // Add completion (toggle on)
      console.log('➕ Adding new completion')
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
        console.error('❌ Error adding completion:', insertError)
        return NextResponse.json({ error: 'Failed to add completion' }, { status: 500 })
      }

      isCompleted = true
      completionData = newCompletion
      console.log('✅ Completion added successfully:', newCompletion?.id)
    }

    const response = {
      success: true,
      isCompleted,
      completion: completionData,
      date: today
    }
    
    console.log('🎉 Toggle completion successful:', response)
    return NextResponse.json(response)

  } catch (error) {
    console.error('💥 Unexpected error in POST /api/habits/[id]/complete:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 