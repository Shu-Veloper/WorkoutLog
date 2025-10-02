-- Reset Database: Drop all tables and recreate with current schema
-- WARNING: This will delete ALL data! Only use in development.
-- Run this in Supabase SQL Editor

-- 1. Drop all tables (CASCADE removes dependent objects like policies, indexes)
DROP TABLE IF EXISTS public.workout_sets CASCADE;
DROP TABLE IF EXISTS public.workouts CASCADE;
DROP TABLE IF EXISTS public.exercises CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. Drop triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Recreate all tables with current schema

-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercises table
CREATE TABLE public.exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL CHECK (unit IN ('weight', 'bodyweight', 'cardio')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workouts table
CREATE TABLE public.workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  title TEXT,
  notes TEXT,
  duration INTEGER, -- minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_sets table
CREATE TABLE public.workout_sets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  weight DECIMAL(5,2), -- kg
  reps INTEGER,
  duration INTEGER, -- seconds
  distance DECIMAL(5,2), -- km
  rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10), -- Rate of Perceived Exertion
  completed BOOLEAN DEFAULT FALSE
);

-- 4. Recreate Row Level Security Policies

-- Users can only see their own data
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Workouts are private to each user
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own workouts" ON public.workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workouts" ON public.workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workouts" ON public.workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workouts" ON public.workouts FOR DELETE USING (auth.uid() = user_id);

-- Workout sets belong to user's workouts
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own workout sets" ON public.workout_sets FOR SELECT
USING (EXISTS (SELECT 1 FROM public.workouts WHERE workouts.id = workout_sets.workout_id AND workouts.user_id = auth.uid()));
CREATE POLICY "Users can insert own workout sets" ON public.workout_sets FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.workouts WHERE workouts.id = workout_sets.workout_id AND workouts.user_id = auth.uid()));
CREATE POLICY "Users can update own workout sets" ON public.workout_sets FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.workouts WHERE workouts.id = workout_sets.workout_id AND workouts.user_id = auth.uid()));
CREATE POLICY "Users can delete own workout sets" ON public.workout_sets FOR DELETE
USING (EXISTS (SELECT 1 FROM public.workouts WHERE workouts.id = workout_sets.workout_id AND workouts.user_id = auth.uid()));

-- Exercises are public (all users can see)
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view exercises" ON public.exercises FOR SELECT TO authenticated USING (true);

-- 5. Insert default exercises with current schema
INSERT INTO public.exercises (name, category, unit) VALUES
('벤치프레스', '가슴', 'weight'),
('인클라인 벤치프레스', '가슴', 'weight'),
('스쿼트', '다리', 'weight'),
('데드리프트', '등', 'weight'),
('오버헤드 프레스', '어깨', 'weight'),
('바벨로우', '등', 'weight'),
('풀업', '등', 'bodyweight'),
('딥스', '가슴', 'bodyweight'),
('푸시업', '가슴', 'bodyweight'),
('런지', '다리', 'weight'),
('레그프레스', '다리', 'weight'),
('런닝', '유산소', 'cardio'),
('사이클', '유산소', 'cardio');

-- 6. Recreate function and trigger for user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Create indexes for better performance
CREATE INDEX idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX idx_workouts_date ON public.workouts(date);
CREATE INDEX idx_workout_sets_workout_id ON public.workout_sets(workout_id);
CREATE INDEX idx_workout_sets_exercise_id ON public.workout_sets(exercise_id);

-- 8. Verify the reset
SELECT 'Database reset complete!' as status;
SELECT 'Available exercises:' as info;
SELECT name, category, unit FROM public.exercises ORDER BY category, name;