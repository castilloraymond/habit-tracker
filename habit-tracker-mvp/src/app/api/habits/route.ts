import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { CreateHabitData } from '@/lib/types/habit'

// GET /api/habits - Fetch user's habits
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's habits
    const { data: habits, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching habits:', error)
      return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 })
    }

    return NextResponse.json({ data: habits })
  } catch (error) {
    console.error('Unexpected error in GET /api/habits:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/habits - Create new habit
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body: CreateHabitData = await request.json()
    
    // Validate required fields
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json({ error: 'Habit name is required' }, { status: 400 })
    }

    // Prepare habit data for database
    const habitData = {
      user_id: user.id,
      name: body.name.trim(),
      description: body.description?.trim() || null,
      color: body.color || '#3B82F6',
      category: body.category || 'other',
      frequency_type: body.frequency_type || 'daily',
      target_count: body.target_count || 1,
      custom_interval_type: body.custom_interval_type || null,
      custom_interval_value: body.custom_interval_value || null,
      custom_specific_days: body.custom_specific_days || null,
      is_active: true,
    }

    // Insert habit into database
    const { data: habit, error } = await supabase
      .from('habits')
      .insert([habitData])
      .select()
      .single()

    if (error) {
      console.error('Error creating habit:', error)
      return NextResponse.json({ error: 'Failed to create habit' }, { status: 500 })
    }

    return NextResponse.json({ data: habit }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/habits:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 