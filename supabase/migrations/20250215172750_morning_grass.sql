-- Add company_name column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS company_name text;