/*
  # Add checkout URL to products

  1. Changes
    - Add checkout_url column to products table
*/

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS checkout_url text;