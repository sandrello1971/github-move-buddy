-- SCRIPT COMPLETO PER RICREARE CONFIGURAZIONE SUPABASE
-- Esegui questo script nel nuovo progetto Supabase

-- 1. Crea enum per i ruoli
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'subscriber');

-- 2. Crea tabella categories
CREATE TABLE public.categories (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 3. Crea tabella profiles
CREATE TABLE public.profiles (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 4. Crea tabella posts
CREATE TABLE public.posts (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    excerpt text,
    featured_image text,
    status text NOT NULL DEFAULT 'draft',
    author_id uuid NOT NULL,
    published_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 5. Crea tabella user_roles
CREATE TABLE public.user_roles (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 6. Crea tabella post_categories
CREATE TABLE public.post_categories (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id uuid NOT NULL,
    category_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 7. Abilita RLS su tutte le tabelle
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;

-- 8. Crea funzioni
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'subscriber');
    RETURN NEW;
END;
$$;

-- 9. Crea trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_role_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Crea policies RLS per categories
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create categories" ON public.categories FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update categories" ON public.categories FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete categories" ON public.categories FOR DELETE USING (auth.uid() IS NOT NULL);

-- 11. Crea policies RLS per profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'::app_role));

-- 12. Crea policies RLS per posts
CREATE POLICY "Published posts are viewable by everyone" ON public.posts FOR SELECT USING (status = 'published');
CREATE POLICY "Authors can view their own posts" ON public.posts FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update their own posts" ON public.posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete their own posts" ON public.posts FOR DELETE USING (auth.uid() = author_id);

-- 13. Crea policies RLS per user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- 14. Crea policies RLS per post_categories
CREATE POLICY "Post categories are viewable by everyone" ON public.post_categories FOR SELECT USING (true);
CREATE POLICY "Authors can manage their post categories" ON public.post_categories FOR ALL USING (EXISTS (SELECT 1 FROM posts WHERE posts.id = post_categories.post_id AND posts.author_id = auth.uid()));

-- 15. Crea storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true);

-- 16. Crea storage policies
CREATE POLICY "Post images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'post-images');
CREATE POLICY "Authenticated users can upload post images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'post-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update post images" ON storage.objects FOR UPDATE USING (bucket_id = 'post-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete post images" ON storage.objects FOR DELETE USING (bucket_id = 'post-images' AND auth.uid() IS NOT NULL);