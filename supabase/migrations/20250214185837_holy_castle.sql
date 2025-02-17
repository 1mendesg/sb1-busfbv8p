/*
  # Add user_id to orders table

  1. Changes
    - Add user_id column to cheese_label_orders table
    - Link orders to Supabase auth.users
    
  2. Security
    - Update RLS policies to use user_id
*/

ALTER TABLE cheese_label_orders 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can insert orders" ON cheese_label_orders;
DROP POLICY IF EXISTS "Authenticated users can read all orders" ON cheese_label_orders;

-- Create new policies
CREATE POLICY "Users can insert their own orders"
  ON cheese_label_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own orders"
  ON cheese_label_orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);