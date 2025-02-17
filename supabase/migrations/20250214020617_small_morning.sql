/*
  # Create quotes table with policies

  1. New Tables
    - `quotes`
      - `id` (uuid, primary key)
      - `name` (text)
      - `phone` (text)
      - `company` (text)
      - `email` (text)
      - `message` (text)
      - `status` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `quotes` table
    - Add policies for read and insert operations
*/

-- Create the quotes table if it doesn't exist
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  company text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create new ones
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Authenticated users can read all quotes" ON quotes;
    DROP POLICY IF EXISTS "Anyone can create a new quote" ON quotes;
    
    -- Create new policies
    CREATE POLICY "Authenticated users can read all quotes"
      ON quotes
      FOR SELECT
      TO authenticated
      USING (true);

    CREATE POLICY "Anyone can create a new quote"
      ON quotes
      FOR INSERT
      TO anon
      WITH CHECK (true);
END $$;