-- Fix RLS infinite recursion by creating SECURITY DEFINER functions
-- These functions will be used in RLS policies to avoid recursive table references

-- Function to get current user's profile ID
CREATE OR REPLACE FUNCTION public.get_current_user_profile_id()
RETURNS uuid
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT id FROM public.profiles WHERE user_id = auth.uid());
END;
$$;

-- Function to get current user's role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE user_id = auth.uid());
END;
$$;

-- Function to get current user's discipler ID
CREATE OR REPLACE FUNCTION public.get_current_user_discipler_id()
RETURNS uuid
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT discipler_id FROM public.profiles WHERE user_id = auth.uid());
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_current_user_profile_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_discipler_id() TO authenticated;

-- Drop existing problematic policies on profiles table
DROP POLICY IF EXISTS "Disciplers can view their disciples profiles" ON public.profiles;
DROP POLICY IF EXISTS "Disciples can view their discipler profile" ON public.profiles;
DROP POLICY IF EXISTS "Masters can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Masters can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile except role" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Recreate policies using SECURITY DEFINER functions to prevent recursion
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile except role"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND role = (SELECT p.role FROM public.profiles p WHERE p.user_id = auth.uid()));

CREATE POLICY "Masters can view all profiles"
ON public.profiles
FOR SELECT
USING (public.get_current_user_role() = 'master');

CREATE POLICY "Masters can update any profile"
ON public.profiles
FOR UPDATE
USING (public.get_current_user_role() = 'master');

CREATE POLICY "Disciplers can view their disciples profiles"
ON public.profiles
FOR SELECT
USING (
  public.get_current_user_role() = 'discipler' AND 
  discipler_id = public.get_current_user_profile_id()
);

CREATE POLICY "Disciples can view their discipler profile"
ON public.profiles
FOR SELECT
USING (
  public.get_current_user_role() = 'disciple' AND 
  id = public.get_current_user_discipler_id()
);