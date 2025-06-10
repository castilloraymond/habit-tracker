import { Migration } from './migration-utils'

const upSQL = `
-- Create habit frequency type
CREATE TYPE public.habit_frequency_type AS ENUM ('daily', 'weekly', 'custom');

-- Create habits table with frequency support
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color code
    category VARCHAR(100),
    
    -- Frequency configuration
    frequency_type habit_frequency_type NOT NULL DEFAULT 'daily',
    frequency_config JSONB DEFAULT '{}', -- Additional frequency configuration
    
    -- For custom frequencies
    custom_interval_type VARCHAR(20), -- 'days' or 'weeks'
    custom_interval_value INTEGER, -- e.g., every 3 days, every 2 weeks
    custom_specific_days INTEGER[], -- Array of weekday numbers (0=Sunday, 6=Saturday)
    
    -- Goal tracking
    target_count INTEGER DEFAULT 1, -- How many times per frequency period
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT habits_color_format CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
    CONSTRAINT habits_target_count_positive CHECK (target_count > 0),
    CONSTRAINT habits_custom_interval_positive CHECK (
        (frequency_type != 'custom') OR 
        (custom_interval_value IS NOT NULL AND custom_interval_value > 0)
    )
);

-- Create trigger for updated_at
CREATE TRIGGER habits_updated_at
    BEFORE UPDATE ON public.habits
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS habits_user_id_idx ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS habits_frequency_type_idx ON public.habits(frequency_type);
CREATE INDEX IF NOT EXISTS habits_is_active_idx ON public.habits(is_active);
CREATE INDEX IF NOT EXISTS habits_created_at_idx ON public.habits(created_at);
CREATE INDEX IF NOT EXISTS habits_user_active_idx ON public.habits(user_id, is_active);

-- Create composite index for queries
CREATE INDEX IF NOT EXISTS habits_user_frequency_active_idx 
    ON public.habits(user_id, frequency_type, is_active);
`

const downSQL = `
-- Drop habits table and related objects
DROP TRIGGER IF EXISTS habits_updated_at ON public.habits;
DROP INDEX IF EXISTS habits_user_frequency_active_idx;
DROP INDEX IF EXISTS habits_user_active_idx;
DROP INDEX IF EXISTS habits_created_at_idx;
DROP INDEX IF EXISTS habits_is_active_idx;
DROP INDEX IF EXISTS habits_frequency_type_idx;
DROP INDEX IF EXISTS habits_user_id_idx;
DROP TABLE IF EXISTS public.habits;
DROP TYPE IF EXISTS public.habit_frequency_type;
`

export const migration_002_create_habits: Migration = {
  id: 'create_habits',
  name: 'Create habits table with frequency support',
  version: 2,
  timestamp: new Date('2024-01-01T01:00:00Z'),
  up: upSQL,
  down: downSQL
} 