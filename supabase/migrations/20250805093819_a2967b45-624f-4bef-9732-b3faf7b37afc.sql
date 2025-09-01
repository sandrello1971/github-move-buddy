-- Assegna ruolo admin all'utente corrente (Stefano)
-- Prima verifica se l'utente esiste nella tabella profiles
INSERT INTO public.user_roles (user_id, role)
SELECT 'bdfaacc0-bdbf-43f2-96fe-5333592e3408', 'admin'
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = 'bdfaacc0-bdbf-43f2-96fe-5333592e3408' 
    AND role = 'admin'
);