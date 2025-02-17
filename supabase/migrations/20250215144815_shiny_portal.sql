/*
  # Fix Orders Schema

  1. Changes
    - Add missing columns to orders table
    - Fix foreign key relationships
    - Add artwork storage support

  2. Security
    - Maintain existing RLS policies
*/

-- Add missing columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS artwork_url text,
ADD COLUMN IF NOT EXISTS has_varnish boolean DEFAULT false;

-- Ensure foreign key relationships are properly set up
DO $$ 
BEGIN
  -- Drop existing foreign key if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'orders_user_id_fkey'
  ) THEN
    ALTER TABLE orders DROP CONSTRAINT orders_user_id_fkey;
  END IF;

  -- Add foreign key with proper reference to auth.users
  ALTER TABLE orders
  ADD CONSTRAINT orders_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

  -- Add foreign key for product_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'orders_product_id_fkey'
  ) THEN
    ALTER TABLE orders
    ADD CONSTRAINT orders_product_id_fkey 
      FOREIGN KEY (product_id) 
      REFERENCES products(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- Create storage bucket for artwork if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'artwork-files'
  ) THEN
    insert into storage.buckets (id, name, public)
    values ('artwork-files', 'artwork-files', true);

    -- Allow authenticated users to upload artwork
    create policy "Authenticated users can upload artwork"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'artwork-files');

    -- Allow public access to view artwork
    create policy "Anyone can view artwork"
    on storage.objects for select
    to public
    using (bucket_id = 'artwork-files');
  END IF;
END $$;