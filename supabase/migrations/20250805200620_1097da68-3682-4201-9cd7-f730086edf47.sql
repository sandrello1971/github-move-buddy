-- Creare bucket per le immagini dei post
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true);

-- Creare policy per il bucket post-images
CREATE POLICY "Chiunque può vedere le immagini" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'post-images');

CREATE POLICY "Utenti autenticati possono caricare immagini" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'post-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Utenti autenticati possono aggiornare le proprie immagini" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'post-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Utenti autenticati possono eliminare le proprie immagini" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'post-images' AND auth.uid() IS NOT NULL);