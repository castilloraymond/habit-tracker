import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { CreateHabitData } from '@/lib/types/habit'

// GET /api/habits/[id] - Get a specific habit
export async function GET(
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

    // Fetch the habit
    const { data: habit, error } = await supabase
      .from('habits')
      .select('*')
      .eq('id', habitId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching habit:', error)
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    return NextResponse.json({ data: habit })
  } catch (error) {
    console.error('Unexpected error in GET /api/habits/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/habits/[id] - Update a habit
export async function PUT(
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

    // Parse request body
    const body: CreateHabitData = await request.json()
    
    // Validate required fields
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json({ error: 'Habit name is required' }, { status: 400 })
    }

    // Prepare habit data for update
    const habitData = {
      name: body.name.trim(),
      description: body.description?.trim() || null,
      color: body.color || '#3B82F6',
      category: body.category || 'other',
      target_count: body.target_count || 1,
      updated_at: new Date().toISOString(),
    }

    // Update habit in database
    const { data: habit, error } = await supabase
      .from('habits')
      .update(habitData)
      .eq('id', habitId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating habit:', error)
      return NextResponse.json({ error: 'Failed to update habit' }, { status: 500 })
    }

    return NextResponse.json({ data: habit })
  } catch (error) {
    console.error('Unexpected error in PUT /api/habits/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/habits/[id] - Delete a habit
export async function DELETE(
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

    // Delete habit from database
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting habit:', error)
      return NextResponse.json({ error: 'Failed to delete habit' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error in DELETE /api/habits/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 