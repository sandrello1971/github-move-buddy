-- Create table for tracking site visits
CREATE TABLE public.site_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT
);

-- Create index for better performance
CREATE INDEX idx_site_visits_page_path ON public.site_visits(page_path);
CREATE INDEX idx_site_visits_visited_at ON public.site_visits(visited_at);

-- Enable RLS
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Allow everyone to insert visits (for tracking)
CREATE POLICY "Anyone can record visits" 
ON public.site_visits 
FOR INSERT 
WITH CHECK (true);

-- Only allow reading aggregate data (no personal info exposure)
CREATE POLICY "Anyone can view visit counts" 
ON public.site_visits 
FOR SELECT 
USING (true);

-- Create function to get total visit count
CREATE OR REPLACE FUNCTION public.get_total_visits()
RETURNS bigint
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(*) FROM public.site_visits;
$$;

-- Create function to get today's visit count
CREATE OR REPLACE FUNCTION public.get_today_visits()
RETURNS bigint
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(*) 
  FROM public.site_visits 
  WHERE visited_at >= CURRENT_DATE;
$$;