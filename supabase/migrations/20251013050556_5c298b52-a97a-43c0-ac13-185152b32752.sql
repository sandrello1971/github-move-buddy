-- Aggiungi policy per permettere agli admin di vedere tutti i post
CREATE POLICY "Admins can view all posts"
ON posts
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Aggiungi policy per permettere agli admin di modificare tutti i post
CREATE POLICY "Admins can update all posts"
ON posts
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Aggiungi policy per permettere agli admin di eliminare tutti i post
CREATE POLICY "Admins can delete all posts"
ON posts
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));