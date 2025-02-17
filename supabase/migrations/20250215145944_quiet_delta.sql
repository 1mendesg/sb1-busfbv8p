-- Create storage bucket for site images
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true);

-- Allow authenticated users to upload site images
create policy "Authenticated users can upload site images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'site-images' AND
  auth.role() = 'authenticated'
);

-- Allow public access to view site images
create policy "Anyone can view site images"
on storage.objects for select
to public
using ( bucket_id = 'site-images' );

-- Create site_images table
CREATE TABLE IF NOT EXISTS site_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  section text NOT NULL CHECK (section IN ('banner', 'solution', 'custom_label', 'logo')),
  current_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view site images"
  ON site_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admin can modify site images"
  ON site_images
  FOR ALL
  TO authenticated
  USING (auth.email() = 'luciano@usualetiquetas.com.br')
  WITH CHECK (auth.email() = 'luciano@usualetiquetas.com.br');

-- Insert default image sections
INSERT INTO site_images (title, description, section) VALUES
  ('Banner Principal 1', 'Banner principal da página inicial - Posição 1', 'banner'),
  ('Banner Principal 2', 'Banner principal da página inicial - Posição 2', 'banner'),
  ('Banner Principal 3', 'Banner principal da página inicial - Posição 3', 'banner'),
  ('Logo Principal', 'Logo principal do site', 'logo'),
  ('Logo Branco', 'Versão branca do logo para fundos escuros', 'logo'),
  ('Etiquetas para Frigoríficos', 'Imagem da seção de etiquetas para frigoríficos', 'solution'),
  ('Etiquetas para Laticínios', 'Imagem da seção de etiquetas para laticínios', 'solution'),
  ('Etiquetas de Garrão', 'Imagem da seção de etiquetas de garrão', 'solution'),
  ('Etiquetas para Supermercados', 'Imagem da seção de etiquetas para supermercados', 'solution'),
  ('Etiquetas para Delivery', 'Imagem da seção de etiquetas para delivery', 'solution'),
  ('Etiquetas Personalizadas', 'Imagem principal da seção de etiquetas personalizadas', 'custom_label')
ON CONFLICT DO NOTHING;