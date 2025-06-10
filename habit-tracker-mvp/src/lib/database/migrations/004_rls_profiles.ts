import { Migration } from './migration-utils'

const upSQL = `
-- Enable Row Level Security on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own profile
CREATE POLICY profiles_select_own 
    ON public.profiles 
    FOR SELECT 
    USING (auth.uid() = id);

-- Policy: Users can only insert their own profile
CREATE POLICY profiles_insert_own 
    ON public.profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Policy: Users can only update their own profile
CREATE POLICY profiles_update_own 
    ON public.profiles 
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy: Users can only delete their own profile
CREATE POLICY profiles_delete_own 
    ON public.profiles 
    FOR DELETE 
    USING (auth.uid() = id);

-- Create function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile for new users
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
`

const downSQL = `
-- Drop trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop RLS policies
DROP POLICY IF EXISTS profiles_delete_own ON public.profiles;
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;

-- Disable Row Level Security
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
`

export const migration_004_rls_profiles: Migration = {
  id: 'rls_profiles',
  name: 'Configure Row Level Security for profiles',
  version: 4,
  timestamp: new Date('2024-01-01T03:00:00Z'),
  up: upSQL,
  down: downSQL
} 