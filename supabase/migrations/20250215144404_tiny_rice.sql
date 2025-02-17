/*
  # Fix Schema and Add Missing Columns

  1. New Columns
    - Add color_range and has_varnish_option to products table
    - Add missing foreign key relationships

  2. Changes
    - Fix user_id foreign key in orders table
    - Add missing columns to products table
    - Update existing tables with proper relationships

  3. Security
    - Maintain existing RLS policies
*/

-- Add new columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS color_range text DEFAULT '0-2',
ADD COLUMN IF NOT EXISTS has_varnish_option boolean DEFAULT false;

-- Fix orders table foreign key relationship
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_user_id_fkey,
ADD CONSTRAINT orders_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- Create user_profiles if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'user_profiles'
  ) THEN
    CREATE TABLE user_profiles (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
      full_name text,
      cpf_cnpj text,
      phone text,
      address text,
      city text,
      state text,
      zip_code text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      UNIQUE(user_id)
    );

    ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view own profile"
      ON user_profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can update own profile"
      ON user_profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own profile"
      ON user_profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;