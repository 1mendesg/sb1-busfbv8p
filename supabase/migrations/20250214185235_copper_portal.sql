/*
  # Create cheese label orders table

  1. New Tables
    - `cheese_label_orders`
      - `id` (uuid, primary key)
      - `size` (text) - Size of the label (60x60mm, 80x80mm, 100x150mm)
      - `color_range` (text) - Range of colors (0-2, 2-4, 4-6)
      - `has_varnish` (boolean) - Whether the label has varnish
      - `quantity` (integer) - Number of labels ordered (1000, 2000, 4000)
      - `total_price` (numeric) - Final calculated price
      - `created_at` (timestamp)
      - `status` (text) - Order status (pending, processing, completed)

  2. Security
    - Enable RLS on `cheese_label_orders` table
    - Add policy for public to insert orders
    - Add policy for authenticated users to read all orders
*/

CREATE TABLE IF NOT EXISTS cheese_label_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  size text NOT NULL,
  color_range text NOT NULL,
  has_varnish boolean NOT NULL DEFAULT false,
  quantity integer NOT NULL,
  total_price numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cheese_label_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert orders"
  ON cheese_label_orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read all orders"
  ON cheese_label_orders
  FOR SELECT
  TO authenticated
  USING (true);