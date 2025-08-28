-- Fix security warnings: Add search_path to functions

-- Update get_current_user_role function with search_path
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE user_id = auth.uid());
END;
$$;

-- Update get_current_user_profile_id function with search_path  
CREATE OR REPLACE FUNCTION public.get_current_user_profile_id()
RETURNS UUID 
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN (SELECT id FROM public.profiles WHERE user_id = auth.uid());
END;
$$;

-- Update update_updated_at_column function with search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;