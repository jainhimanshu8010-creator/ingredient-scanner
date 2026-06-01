/*
  # Create Diet Plan Tables

  1. New Tables
    - `user_diet_profiles`
      - User's physical metrics (weight, height, BMI)
      - Dosha type (Ayurvedic body type)
      - Health goals and dietary restrictions
      - Activity level for calorie calculations

    - `diet_plans`
      - Generated Ayurveda-focused meal plans
      - Personalized for user's dosha type
      - Includes breakfast, lunch, dinner, snacks
      - Recommended herbs, spices, and guidelines

  2. Security
    - Enable RLS: Users can only access their own data
    - Each user has one diet profile
    - Each user has one active diet plan
*/

CREATE TABLE IF NOT EXISTS user_diet_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  weight numeric NOT NULL CHECK (weight > 0),
  height numeric NOT NULL CHECK (height > 0),
  bmi numeric GENERATED ALWAYS AS (ROUND(weight / ((height / 100) ^ 2), 2)) STORED,
  body_type text DEFAULT 'pitta' CHECK (body_type IN ('vata', 'pitta', 'kapha', 'vata-pitta', 'pitta-kapha', 'vata-kapha')),
  health_goal text DEFAULT 'maintenance' CHECK (health_goal IN ('weight_loss', 'muscle_gain', 'maintenance', 'energy_boost', 'digestion_improvement')),
  dietary_restrictions text[] DEFAULT '{}',
  medical_conditions text,
  activity_level text DEFAULT 'moderate' CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS diet_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  diet_profile_id uuid NOT NULL REFERENCES user_diet_profiles(id) ON DELETE CASCADE,
  dosha_type text NOT NULL CHECK (dosha_type IN ('vata', 'pitta', 'kapha')),
  daily_calories numeric NOT NULL DEFAULT 2000,
  breakfast jsonb DEFAULT '{}'::jsonb,
  lunch jsonb DEFAULT '{}'::jsonb,
  dinner jsonb DEFAULT '{}'::jsonb,
  snacks jsonb DEFAULT '{}'::jsonb,
  herbs_spices jsonb DEFAULT '{}'::jsonb,
  guidelines text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '30 days')
);

ALTER TABLE user_diet_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own diet profile"
  ON user_diet_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diet profile"
  ON user_diet_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diet profile"
  ON user_diet_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own diet plans"
  ON diet_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diet plans"
  ON diet_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diet plans"
  ON diet_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);