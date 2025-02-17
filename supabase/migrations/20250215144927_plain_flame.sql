/*
  # Fix Orders Schema and Relationships

  1. Changes
    - Drop and recreate orders table with proper structure
    - Set up correct foreign key relationships
    - Add all required columns
    - Preserve existing data

  2. Security
    - Maintain RLS policies
    - Ensure proper access controls
*/

-- Create temporary table with only existing columns
CREATE TEMP TABLE temp_orders AS
SELECT 
  id,
  user_id,
  product_id,
  size,
  quantity,
  total_price,
  color_range,
  has_varnish,
  artwork_url,
  price_multiplier,
  status,
  created_at
FROM orders;

-- Drop and recreate orders table with proper structure
DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size text NOT NULL,
  quantity integer NOT NULL,
  total_price numeric NOT NULL,
  color_range text CHECK (color_range IN ('0-2', '2-4', '4-6', '6-8')),
  has_varnish boolean DEFAULT false,
  artwork_url text,
  price_multiplier numeric DEFAULT 1.0,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can insert their own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.email() = 'luciano@usualetiquetas.com.br');

CREATE POLICY "Admin can update orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (auth.email() = 'luciano@usualetiquetas.com.br')
  WITH CHECK (auth.email() = 'luciano@usualetiquetas.com.br');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Restore existing orders if any
INSERT INTO orders (
  id, user_id, product_id, size, quantity, total_price, 
  color_range, has_varnish, artwork_url, price_multiplier, 
  status, created_at, updated_at
)
SELECT 
  id, user_id, product_id, size, quantity, total_price,
  color_range, has_varnish, artwork_url, price_multiplier,
  status, created_at, now()
FROM temp_orders
ON CONFLICT (id) DO NOTHING;