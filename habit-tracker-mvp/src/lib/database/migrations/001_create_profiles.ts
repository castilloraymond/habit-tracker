import { Migration } from './migration-utils'

const upSQL = `
-- Create profiles table
-- This extends the auth.users table with additional profile information

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    date_format VARCHAR(20) DEFAULT 'YYYY-MM-DD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(created_at);
`

const downSQL = `
-- Drop profiles table and related objects
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
DROP INDEX IF EXISTS profiles_created_at_idx;
DROP INDEX IF EXISTS profiles_email_idx;
DROP TABLE IF EXISTS public.profiles;
-- Note: We keep the handle_updated_at function as it might be used by other tables
`

export const migration_001_create_profiles: Migration = {
  id: 'create_profiles',
  name: 'Create profiles table',
  version: 1,
  timestamp: new Date('2024-01-01T00:00:00Z'),
  up: upSQL,
  down: downSQL
} 