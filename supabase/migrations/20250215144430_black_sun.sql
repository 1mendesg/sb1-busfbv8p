/*
  # Update Orders Schema

  1. Changes
    - Add color_range and price_multiplier columns to orders table
    - Update orders constraints and relationships

  2. Security
    - Maintain existing RLS policies
*/

-- Add color range and price multiplier to orders
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS color_range text,
ADD COLUMN IF NOT EXISTS price_multiplier numeric DEFAULT 1.0;

-- Add check constraint for valid color ranges
ALTER TABLE orders
ADD CONSTRAINT valid_color_range 
CHECK (color_range IN ('0-2', '2-4', '4-6', '6-8'));