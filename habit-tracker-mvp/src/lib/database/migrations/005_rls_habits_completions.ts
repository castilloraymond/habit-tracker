import { Migration } from './migration-utils'

const upSQL = `
-- Enable Row Level Security on habits table
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security on habit_completions table
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;

-- HABITS TABLE POLICIES
-- Policy: Users can only view their own habits
CREATE POLICY habits_select_own 
    ON public.habits 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy: Users can only insert their own habits
CREATE POLICY habits_insert_own 
    ON public.habits 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own habits
CREATE POLICY habits_update_own 
    ON public.habits 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own habits
CREATE POLICY habits_delete_own 
    ON public.habits 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- HABIT COMPLETIONS TABLE POLICIES
-- Policy: Users can only view their own completions
CREATE POLICY habit_completions_select_own 
    ON public.habit_completions 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy: Users can only insert their own completions
CREATE POLICY habit_completions_insert_own 
    ON public.habit_completions 
    FOR INSERT 
    WITH CHECK (
        auth.uid() = user_id AND 
        EXISTS (
            SELECT 1 FROM public.habits 
            WHERE id = habit_id AND user_id = auth.uid()
        )
    );

-- Policy: Users can only update their own completions
CREATE POLICY habit_completions_update_own 
    ON public.habit_completions 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (
        auth.uid() = user_id AND 
        EXISTS (
            SELECT 1 FROM public.habits 
            WHERE id = habit_id AND user_id = auth.uid()
        )
    );

-- Policy: Users can only delete their own completions
CREATE POLICY habit_completions_delete_own 
    ON public.habit_completions 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Create helper functions for RPC operations
CREATE OR REPLACE FUNCTION public.create_migrations_table()
RETURNS VOID AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS public.migrations (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        version INTEGER NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.execute_migration(migration_sql TEXT)
RETURNS VOID AS $$
BEGIN
    EXECUTE migration_sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`

const downSQL = `
-- Drop helper functions
DROP FUNCTION IF EXISTS public.execute_migration(TEXT);
DROP FUNCTION IF EXISTS public.create_migrations_table();

-- Drop habit completions policies
DROP POLICY IF EXISTS habit_completions_delete_own ON public.habit_completions;
DROP POLICY IF EXISTS habit_completions_update_own ON public.habit_completions;
DROP POLICY IF EXISTS habit_completions_insert_own ON public.habit_completions;
DROP POLICY IF EXISTS habit_completions_select_own ON public.habit_completions;

-- Drop habits policies
DROP POLICY IF EXISTS habits_delete_own ON public.habits;
DROP POLICY IF EXISTS habits_update_own ON public.habits;
DROP POLICY IF EXISTS habits_insert_own ON public.habits;
DROP POLICY IF EXISTS habits_select_own ON public.habits;

-- Disable Row Level Security
ALTER TABLE public.habit_completions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits DISABLE ROW LEVEL SECURITY;
`

export const migration_005_rls_habits_completions: Migration = {
  id: 'rls_habits_completions',
  name: 'Configure Row Level Security for habits and completions',
  version: 5,
  timestamp: new Date('2024-01-01T04:00:00Z'),
  up: upSQL,
  down: downSQL
} 