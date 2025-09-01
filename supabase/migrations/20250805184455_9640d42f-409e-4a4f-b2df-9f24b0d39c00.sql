-- Creare tabella per relazione many-to-many tra post e categorie
CREATE TABLE public.post_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, category_id)
);

-- Abilita RLS
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;

-- Migra i dati esistenti dalla tabella posts
INSERT INTO public.post_categories (post_id, category_id)
SELECT id, category_id 
FROM public.posts 
WHERE category_id IS NOT NULL;

-- Rimuovi la colonna category_id dalla tabella posts
ALTER TABLE public.posts DROP COLUMN category_id;

-- Politiche RLS per post_categories
CREATE POLICY "Post categories are viewable by everyone" 
ON public.post_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Authors can manage their post categories" 
ON public.post_categories 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = post_categories.post_id 
    AND posts.author_id = auth.uid()
  )
);

-- Indice per performance
CREATE INDEX idx_post_categories_post_id ON public.post_categories(post_id);
CREATE INDEX idx_post_categories_category_id ON public.post_categories(category_id);