-- Rimuovi la policy che permette a chiunque di leggere tutti i dati della tabella site_visits
DROP POLICY IF EXISTS "Anyone can view visit counts" ON site_visits;

-- Crea una nuova policy che permette solo agli admin di leggere i dati sensibili
CREATE POLICY "Only admins can view visit details" 
ON site_visits 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Crea una policy per permettere a tutti di chiamare le funzioni aggregate pubbliche
-- (le funzioni get_total_visits e get_today_visits sono già sicure perché restituiscono solo conteggi)

-- Assicuriamoci che le funzioni esistenti siano sicure e utilizzino SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_total_visits()
RETURNS bigint
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) FROM public.site_visits;
$$;

CREATE OR REPLACE FUNCTION public.get_today_visits()
RETURNS bigint
LANGUAGE sql
STABLE SECURITY DEFINER  
SET search_path = public
AS $$
  SELECT COUNT(*) 
  FROM public.site_visits 
  WHERE visited_at >= CURRENT_DATE;
$$;