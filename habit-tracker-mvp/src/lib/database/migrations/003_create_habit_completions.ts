import { Migration } from './migration-utils'

const upSQL = `
-- Create habit completions table
CREATE TABLE IF NOT EXISTS public.habit_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Completion tracking
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completion_date DATE NOT NULL, -- The date this completion counts for
    
    -- Additional completion data
    notes TEXT,
    quantity INTEGER DEFAULT 1, -- For habits that track quantity (e.g., 3 glasses of water)
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT habit_completions_quantity_positive CHECK (quantity > 0),
    
    -- Prevent duplicate completions for the same habit on the same date
    CONSTRAINT habit_completions_unique_date UNIQUE (habit_id, completion_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS habit_completions_habit_id_idx ON public.habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS habit_completions_user_id_idx ON public.habit_completions(user_id);
CREATE INDEX IF NOT EXISTS habit_completions_completion_date_idx ON public.habit_completions(completion_date);
CREATE INDEX IF NOT EXISTS habit_completions_completed_at_idx ON public.habit_completions(completed_at);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS habit_completions_habit_date_idx 
    ON public.habit_completions(habit_id, completion_date);
    
CREATE INDEX IF NOT EXISTS habit_completions_user_date_idx 
    ON public.habit_completions(user_id, completion_date);
    
CREATE INDEX IF NOT EXISTS habit_completions_user_habit_idx 
    ON public.habit_completions(user_id, habit_id);

-- Index for date range queries (analytics)
CREATE INDEX IF NOT EXISTS habit_completions_user_date_range_idx 
    ON public.habit_completions(user_id, completion_date DESC);
`

const downSQL = `
-- Drop habit completions table and related objects
DROP INDEX IF EXISTS habit_completions_user_date_range_idx;
DROP INDEX IF EXISTS habit_completions_user_habit_idx;
DROP INDEX IF EXISTS habit_completions_user_date_idx;
DROP INDEX IF EXISTS habit_completions_habit_date_idx;
DROP INDEX IF EXISTS habit_completions_completed_at_idx;
DROP INDEX IF EXISTS habit_completions_completion_date_idx;
DROP INDEX IF EXISTS habit_completions_user_id_idx;
DROP INDEX IF EXISTS habit_completions_habit_id_idx;
DROP TABLE IF EXISTS public.habit_completions;
`

export const migration_003_create_habit_completions: Migration = {
  id: 'create_habit_completions',
  name: 'Create habit completions table',
  version: 3,
  timestamp: new Date('2024-01-01T02:00:00Z'),
  up: upSQL,
  down: downSQL
} 