-- Drop existing foreign key if it exists
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Add foreign key relationship to auth.users
ALTER TABLE orders
ADD CONSTRAINT orders_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Add missing columns if they don't exist
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_status text,
ADD COLUMN IF NOT EXISTS payment_id text;

-- Create index on user_id for better query performance
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);

-- Create index on created_at for better sorting performance
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);

-- Update RLS policies to ensure proper access
DROP POLICY IF EXISTS "Users can read their own orders" ON orders;
CREATE POLICY "Users can read their own orders"
ON orders FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR 
  auth.email() = 'luciano@usualetiquetas.com.br'
);

DROP POLICY IF EXISTS "Admin can read all orders" ON orders;
CREATE POLICY "Admin can read all orders"
ON orders FOR SELECT
TO authenticated
USING (auth.email() = 'luciano@usualetiquetas.com.br');

DROP POLICY IF EXISTS "Admin can update orders" ON orders;
CREATE POLICY "Admin can update orders"
ON orders FOR UPDATE
TO authenticated
USING (auth.email() = 'luciano@usualetiquetas.com.br')
WITH CHECK (auth.email() = 'luciano@usualetiquetas.com.br');