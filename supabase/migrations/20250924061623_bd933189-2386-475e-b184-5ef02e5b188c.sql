-- Aggiungi colonna email alla tabella profiles se non esiste già
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Aggiorna i profili esistenti con le email dagli auth users
-- NOTA: Questo script dovrebbe essere eseguito con privilegi di service role
UPDATE profiles 
SET email = auth.users.email
FROM auth.users 
WHERE profiles.user_id = auth.users.id 
AND profiles.email IS NULL;

-- Crea una funzione per sincronizzare automaticamente l'email quando un utente si registra
CREATE OR REPLACE FUNCTION public.handle_new_user_email()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    email = NEW.email,
    updated_at = NOW()
  WHERE profiles.email IS NULL OR profiles.email != NEW.email;
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Crea il trigger per la sincronizzazione automatica
DROP TRIGGER IF EXISTS on_auth_user_created_email ON auth.users;
CREATE TRIGGER on_auth_user_created_email
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_email();