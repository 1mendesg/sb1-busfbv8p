/*
  # Configuração para pedidos de etiquetas personalizadas

  1. Novo Bucket de Armazenamento
    - Bucket 'artwork-files' para armazenar as artes dos clientes
    - Políticas de acesso para upload e visualização

  2. Nova Tabela
    - `custom_label_orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, referência ao usuário)
      - `product_id` (uuid, referência ao produto)
      - `size` (text, tamanho selecionado)
      - `quantity` (integer, quantidade)
      - `total_price` (numeric, preço total)
      - `color_range` (text, faixa de cores)
      - `artwork_url` (text, URL da arte)
      - `status` (text, status do pedido)
      - `created_at` (timestamptz)

  3. Segurança
    - RLS habilitado
    - Políticas para inserção e leitura
*/

-- Criar bucket para artes dos clientes
INSERT INTO storage.buckets (id, name, public)
VALUES ('artwork-files', 'artwork-files', true);

-- Permitir que usuários autenticados façam upload de artes
CREATE POLICY "Usuários autenticados podem fazer upload de artes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'artwork-files');

-- Permitir acesso público para visualização das artes
CREATE POLICY "Qualquer pessoa pode visualizar artes"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'artwork-files');

-- Criar tabela de pedidos de etiquetas personalizadas
CREATE TABLE IF NOT EXISTS custom_label_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  product_id uuid REFERENCES products(id),
  size text NOT NULL,
  quantity integer NOT NULL,
  total_price numeric NOT NULL,
  color_range text NOT NULL,
  artwork_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE custom_label_orders ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
CREATE POLICY "Usuários podem inserir seus próprios pedidos"
ON custom_label_orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver seus próprios pedidos"
ON custom_label_orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Criar trigger para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_custom_label_orders_updated_at
  BEFORE UPDATE ON custom_label_orders
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();