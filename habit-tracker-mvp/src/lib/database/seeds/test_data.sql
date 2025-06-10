-- Comprehensive test data for habit tracker
-- This file creates realistic test data covering all habit frequencies and scenarios

-- Test user profiles (these would be created via auth, this is just for reference)
-- INSERT INTO public.profiles (id, email, full_name, timezone, created_at) VALUES
-- ('550e8400-e29b-41d4-a716-446655440001', 'test@example.com', 'Test User', 'America/New_York', NOW()),
-- ('550e8400-e29b-41d4-a716-446655440002', 'demo@example.com', 'Demo User', 'Europe/London', NOW());

-- Test habits with various frequencies
-- Daily habits
INSERT INTO public.habits (id, user_id, name, description, color, category, frequency_type, target_count, created_at) VALUES
('habit-001', '550e8400-e29b-41d4-a716-446655440001', 'Drink Water', 'Drink 8 glasses of water daily', '#3B82F6', 'Health', 'daily', 8, NOW() - INTERVAL '30 days'),
('habit-002', '550e8400-e29b-41d4-a716-446655440001', 'Morning Meditation', '10 minutes of meditation', '#10B981', 'Wellness', 'daily', 1, NOW() - INTERVAL '20 days'),
('habit-003', '550e8400-e29b-41d4-a716-446655440001', 'Read Book', 'Read for 30 minutes', '#8B5CF6', 'Learning', 'daily', 1, NOW() - INTERVAL '15 days');

-- Weekly habits
INSERT INTO public.habits (id, user_id, name, description, color, category, frequency_type, target_count, created_at) VALUES
('habit-004', '550e8400-e29b-41d4-a716-446655440001', 'Gym Workout', 'Strength training session', '#EF4444', 'Fitness', 'weekly', 3, NOW() - INTERVAL '25 days'),
('habit-005', '550e8400-e29b-41d4-a716-446655440001', 'Call Family', 'Weekly family check-in', '#F59E0B', 'Relationships', 'weekly', 1, NOW() - INTERVAL '10 days');

-- Custom frequency habits
INSERT INTO public.habits (id, user_id, name, description, color, category, frequency_type, custom_interval_type, custom_interval_value, target_count, created_at) VALUES
('habit-006', '550e8400-e29b-41d4-a716-446655440001', 'Deep Clean House', 'Thorough house cleaning', '#06B6D4', 'Home', 'custom', 'days', 7, 1, NOW() - INTERVAL '5 days'),
('habit-007', '550e8400-e29b-41d4-a716-446655440001', 'Visit Dentist', 'Regular dental checkup', '#84CC16', 'Health', 'custom', 'days', 180, 1, NOW() - INTERVAL '60 days');

-- Custom habits with specific days (weekdays only)
INSERT INTO public.habits (id, user_id, name, description, color, category, frequency_type, custom_interval_type, custom_specific_days, target_count, created_at) VALUES
('habit-008', '550e8400-e29b-41d4-a716-446655440001', 'Study Code', 'Programming practice', '#F97316', 'Learning', 'custom', 'days', ARRAY[1,2,3,4,5], 1, NOW() - INTERVAL '12 days');

-- Test completions for various scenarios
-- Recent daily habit completions (last 7 days)
INSERT INTO public.habit_completions (id, habit_id, user_id, completion_date, quantity, created_at) VALUES
-- Water habit completions (varying quantities)
('comp-001', 'habit-001', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '6 days', 8, NOW() - INTERVAL '6 days'),
('comp-002', 'habit-001', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '5 days', 6, NOW() - INTERVAL '5 days'),
('comp-003', 'habit-001', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '4 days', 8, NOW() - INTERVAL '4 days'),
('comp-004', 'habit-001', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '3 days', 7, NOW() - INTERVAL '3 days'),
('comp-005', 'habit-001', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '2 days', 8, NOW() - INTERVAL '2 days'),
('comp-006', 'habit-001', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '1 day', 5, NOW() - INTERVAL '1 day'),

-- Meditation habit completions (consistent)
('comp-007', 'habit-002', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '6 days', 1, NOW() - INTERVAL '6 days'),
('comp-008', 'habit-002', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '5 days', 1, NOW() - INTERVAL '5 days'),
('comp-009', 'habit-002', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '4 days', 1, NOW() - INTERVAL '4 days'),
('comp-010', 'habit-002', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '3 days', 1, NOW() - INTERVAL '3 days'),
('comp-011', 'habit-002', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '1 day', 1, NOW() - INTERVAL '1 day'),

-- Reading habit completions (some missed days)
('comp-012', 'habit-003', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '6 days', 1, NOW() - INTERVAL '6 days'),
('comp-013', 'habit-003', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '4 days', 1, NOW() - INTERVAL '4 days'),
('comp-014', 'habit-003', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '2 days', 1, NOW() - INTERVAL '2 days'),

-- Weekly habit completions
('comp-015', 'habit-004', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '7 days', 1, NOW() - INTERVAL '7 days'),
('comp-016', 'habit-004', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '5 days', 1, NOW() - INTERVAL '5 days'),
('comp-017', 'habit-004', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '3 days', 1, NOW() - INTERVAL '3 days'),

('comp-018', 'habit-005', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '6 days', 1, NOW() - INTERVAL '6 days'),

-- Custom frequency completions
('comp-019', 'habit-006', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '7 days', 1, NOW() - INTERVAL '7 days'),
('comp-020', 'habit-008', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '5 days', 1, NOW() - INTERVAL '5 days'),
('comp-021', 'habit-008', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '4 days', 1, NOW() - INTERVAL '4 days'),
('comp-022', 'habit-008', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '3 days', 1, NOW() - INTERVAL '3 days');

-- Historical completions for streak calculation and analytics (30 days back)
-- Add more historical data for water habit to create interesting patterns
INSERT INTO public.habit_completions (id, habit_id, user_id, completion_date, quantity, created_at) 
SELECT 
    'comp-hist-' || generate_series,
    'habit-001',
    '550e8400-e29b-41d4-a716-446655440001',
    CURRENT_DATE - (generate_series || ' days')::INTERVAL,
    CASE 
        WHEN generate_series % 7 = 0 THEN 4  -- Lower on weekends
        WHEN generate_series % 3 = 0 THEN 6  -- Some variation
        ELSE 8
    END,
    NOW() - (generate_series || ' days')::INTERVAL
FROM generate_series(8, 30) -- Fill gaps in historical data
WHERE generate_series % 4 != 0; -- Miss some days to create realistic patterns

-- Add meditation completions with good streaks
INSERT INTO public.habit_completions (id, habit_id, user_id, completion_date, quantity, created_at) 
SELECT 
    'comp-med-' || generate_series,
    'habit-002',
    '550e8400-e29b-41d4-a716-446655440001',
    CURRENT_DATE - (generate_series || ' days')::INTERVAL,
    1,
    NOW() - (generate_series || ' days')::INTERVAL
FROM generate_series(7, 20) -- Good streak
WHERE generate_series != 15; -- Miss one day to test streak calculation 