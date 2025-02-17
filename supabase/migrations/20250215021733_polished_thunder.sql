-- Create storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true);

-- Allow authenticated users to upload images
create policy "Authenticated users can upload product images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);

-- Allow public access to view images
create policy "Anyone can view product images"
on storage.objects for select
to public
using ( bucket_id = 'product-images' );

-- Allow authenticated users to delete their uploaded images
create policy "Authenticated users can delete product images"
on storage.objects for delete
to authenticated
using ( bucket_id = 'product-images' );