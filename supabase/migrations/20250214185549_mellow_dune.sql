/*
  # Add users and update orders schema

  1. New Tables
    - `customer_profiles`
      - `id` (uuid, primary key)
      - `company_name` (text)
      - `phone` (text)
      - `email` (text)
      - `created_at` (timestamp)

  2. Changes
    - Add customer_id to cheese_label_orders table
    
  3. Security
    - Enable RLS on customer_profiles table
    - Add policies for customer_profiles
*/

CREATE TABLE IF NOT EXISTS customer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cheese_label_orders 
ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES customer_profiles(id);

ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert customer profiles"
  ON customer_profiles
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read all customer profiles"
  ON customer_profiles
  FOR SELECT
  TO authenticated
  USING (true);