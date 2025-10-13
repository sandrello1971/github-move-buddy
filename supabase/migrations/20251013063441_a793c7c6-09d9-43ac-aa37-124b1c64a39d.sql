-- Restrict category management to admin users only
-- Drop existing permissive policies
DROP POLICY IF EXISTS "Authenticated users can create categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can delete categories" ON categories;

-- Create admin-only policies for category management
CREATE POLICY "Only admins can create categories" 
ON categories 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update categories" 
ON categories 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete categories" 
ON categories 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));