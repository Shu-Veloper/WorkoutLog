-- Migration: Update schema from original to current version
-- Run this in Supabase SQL Editor

-- 1. Add distance column to workout_sets table
ALTER TABLE public.workout_sets
ADD COLUMN IF NOT EXISTS distance DECIMAL(5,2); -- km

-- 2. Update exercises unit constraint to include new values
ALTER TABLE public.exercises
DROP CONSTRAINT IF EXISTS exercises_unit_check;

ALTER TABLE public.exercises
ADD CONSTRAINT exercises_unit_check
CHECK (unit IN ('weight', 'bodyweight', 'cardio'));

-- 3. Update existing exercises with old unit values
UPDATE public.exercises
SET unit = 'bodyweight'
WHERE unit = 'reps';

UPDATE public.exercises
SET unit = 'cardio'
WHERE unit = 'time';

-- 4. Insert/Update default exercises to match current schema
INSERT INTO public.exercises (name, category, unit) VALUES
('푸시업', '가슴', 'bodyweight'),
('런닝', '유산소', 'cardio'),
('사이클', '유산소', 'cardio')
ON CONFLICT (name, category) DO UPDATE SET
unit = EXCLUDED.unit;

-- 5. Update specific exercises that might need unit changes
UPDATE public.exercises
SET unit = 'bodyweight', category = '등'
WHERE name = '풀업';

UPDATE public.exercises
SET unit = 'bodyweight', category = '가슴'
WHERE name = '딥스';

-- Verify the changes
SELECT 'Exercises with new units:' as info;
SELECT name, category, unit FROM public.exercises ORDER BY category, name;

SELECT 'Workout_sets table structure:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'workout_sets' AND table_schema = 'public'
ORDER BY ordinal_position;