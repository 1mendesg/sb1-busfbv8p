/*
  # Fix Products RLS Policies

  1. Changes
    - Fix admin policies to be case insensitive for email comparison
    - Add missing WITH CHECK clause for insert policy
    - Ensure policies work correctly for admin operations

  2. Security
    - Maintain read access for all users
    - Restrict write operations to admin only
    - Use case insensitive email comparison
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Only admin can insert products" ON products;
DROP POLICY IF EXISTS "Only admin can update products" ON products;
DROP POLICY IF EXISTS "Only admin can delete products" ON products;

-- Create new policies with case insensitive email comparison
CREATE POLICY "Only admin can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (LOWER(auth.email()) = 'luciano@usualetiquetas.com.br');

CREATE POLICY "Only admin can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (LOWER(auth.email()) = 'luciano@usualetiquetas.com.br')
  WITH CHECK (LOWER(auth.email()) = 'luciano@usualetiquetas.com.br');

CREATE POLICY "Only admin can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (LOWER(auth.email()) = 'luciano@usualetiquetas.com.br');