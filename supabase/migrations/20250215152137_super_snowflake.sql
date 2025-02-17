-- Add banner_text column to site_images table
ALTER TABLE site_images 
ADD COLUMN IF NOT EXISTS banner_text text;

-- Update existing banner records with default text
UPDATE site_images 
SET banner_text = CASE 
  WHEN title = 'Banner Principal 1' THEN 'Já encontrou o seu rótulo?'
  WHEN title = 'Banner Principal 2' THEN 'Eleve a sua marca!'
  WHEN title = 'Banner Principal 3' THEN 'A escolha certa para o seu e-commerce!'
  ELSE NULL
END
WHERE section = 'banner';