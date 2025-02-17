/*
  # Create price configuration table

  1. New Tables
    - `price_config`
      - `id` (integer, primary key)
      - `config` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `price_config` table
    - Add policy for admin to manage configurations
*/

CREATE TABLE IF NOT EXISTS price_config (
  id integer PRIMARY KEY DEFAULT 1,
  config jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_config CHECK (id = 1)
);

ALTER TABLE price_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read price config"
  ON price_config
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admin can update price config"
  ON price_config
  FOR ALL
  TO authenticated
  USING (auth.email() = 'luciano@usualetiquetas.com.br')
  WITH CHECK (auth.email() = 'luciano@usualetiquetas.com.br');

-- Insert default configuration
INSERT INTO price_config (id, config)
VALUES (1, '{
  "colorRanges": {
    "0-2": 1.0,
    "2-4": 1.2,
    "4-6": 1.4,
    "6-8": 1.6
  },
  "varnishMultiplier": 1.15
}'::jsonb)
ON CONFLICT (id) DO NOTHING;