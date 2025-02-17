/*
  # Products table and policies

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `category` (text, not null)
      - `price` (numeric, not null)
      - `dimensions` (text)
      - `image_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `products` table
    - Add policies for:
      - Public read access
      - Admin-only insert/update/delete (based on email)
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  price numeric NOT NULL,
  dimensions text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admin can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = 'Luciano@usualetiquetas.com.br');

CREATE POLICY "Only admin can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (auth.email() = 'Luciano@usualetiquetas.com.br')
  WITH CHECK (auth.email() = 'Luciano@usualetiquetas.com.br');

CREATE POLICY "Only admin can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (auth.email() = 'Luciano@usualetiquetas.com.br');