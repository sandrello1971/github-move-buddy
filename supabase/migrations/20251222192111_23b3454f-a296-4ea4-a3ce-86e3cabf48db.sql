-- Create storage bucket for OG preview pages
INSERT INTO storage.buckets (id, name, public)
VALUES ('og-pages', 'og-pages', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to og-pages bucket
CREATE POLICY "Public read access for og-pages"
ON storage.objects FOR SELECT
USING (bucket_id = 'og-pages');

-- Allow authenticated users to upload/update og-pages (for edge function with service role)
CREATE POLICY "Service role can manage og-pages"
ON storage.objects FOR ALL
USING (bucket_id = 'og-pages')
WITH CHECK (bucket_id = 'og-pages');