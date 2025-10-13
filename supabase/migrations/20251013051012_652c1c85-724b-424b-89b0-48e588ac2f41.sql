-- Aggiungi policy per permettere agli admin di gestire tutte le relazioni post_categories
CREATE POLICY "Admins can manage all post categories"
ON post_categories
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));