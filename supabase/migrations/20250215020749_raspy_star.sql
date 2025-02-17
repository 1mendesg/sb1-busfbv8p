/*
  # Update products table structure

  1. Changes
    - Add product_type column
    - Add min_quantity column
    - Convert dimensions to JSONB with safe default
*/

-- Add new columns
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS product_type text,
ADD COLUMN IF NOT EXISTS min_quantity integer DEFAULT 1000;

-- Create a temporary column for the new JSONB data
ALTER TABLE products 
ADD COLUMN dimensions_new jsonb DEFAULT '[]'::jsonb;

-- Update the new column with converted data where possible
DO $$ 
BEGIN
  UPDATE products 
  SET dimensions_new = json_build_array(
    json_build_object(
      'size', COALESCE(dimensions, ''),
      'price', COALESCE(price, 0),
      'stock', 0
    )
  )::jsonb
  WHERE dimensions IS NOT NULL;
EXCEPTION 
  WHEN OTHERS THEN
    -- If conversion fails, set a default empty array
    UPDATE products 
    SET dimensions_new = '[]'::jsonb
    WHERE dimensions_new IS NULL;
END $$;

-- Drop the old columns and rename the new one
ALTER TABLE products DROP COLUMN dimensions;
ALTER TABLE products DROP COLUMN price;
ALTER TABLE products ALTER COLUMN dimensions_new SET NOT NULL;
ALTER TABLE products RENAME COLUMN dimensions_new TO dimensions;