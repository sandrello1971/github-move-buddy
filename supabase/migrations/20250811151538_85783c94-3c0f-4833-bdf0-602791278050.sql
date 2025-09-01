-- Fix security vulnerability: Restrict profile visibility to authenticated users only
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a new policy that only allows authenticated users to view profiles
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Keep existing policies for profile management unchanged
-- Users can still insert their own profile: "Users can insert their own profile" 
-- Users can still update their own profile: "Users can update their own profile"