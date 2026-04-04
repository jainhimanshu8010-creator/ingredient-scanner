/*
  # Create users table

  1. New Tables
    - `users`
      - `id` (uuid, primary key, links to auth.users)
      - `name` (text, user's full name)
      - `age` (integer, user's age)
      - `city` (text, user's city)
      - `category` (text, user's category: dietician, gym_freak, adult, student)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read their own data
    - Add policy for users to update their own data
    - Add policy for authenticated users to create their own profile
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  age integer NOT NULL,
  city text NOT NULL,
  category text NOT NULL CHECK (category IN ('dietician', 'gym_freak', 'adult', 'student')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
