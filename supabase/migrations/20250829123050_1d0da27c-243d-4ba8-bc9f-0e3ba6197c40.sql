-- Fix Critical Security Vulnerabilities in RLS Policies

-- First, drop the overly permissive profile viewing policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Drop the current update policy that allows role changes
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create granular profile viewing policies
-- 1. Users can view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Masters can view all profiles (for administrative purposes)
CREATE POLICY "Masters can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (get_current_user_role() = 'master');

-- 3. Disciplers can view profiles of their assigned disciples
CREATE POLICY "Disciplers can view their disciples profiles" 
ON public.profiles 
FOR SELECT 
USING (
  get_current_user_role() = 'discipler' 
  AND id IN (
    SELECT id FROM public.profiles 
    WHERE discipler_id = get_current_user_profile_id()
  )
);

-- 4. Disciples can view their discipler's profile
CREATE POLICY "Disciples can view their discipler profile" 
ON public.profiles 
FOR SELECT 
USING (
  get_current_user_role() = 'disciple' 
  AND id = (
    SELECT discipler_id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

-- Create secure update policies
-- 1. Users can update their own profile EXCEPT the role field
CREATE POLICY "Users can update their own profile except role" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id 
  AND (
    -- Ensure role hasn't changed from original value
    role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- 2. Masters can update any profile (including roles)
-- (This policy already exists and is correct)

-- Add input validation functions
CREATE OR REPLACE FUNCTION public.validate_email(email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_phone(phone text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Allow null/empty phone numbers
  IF phone IS NULL OR phone = '' THEN
    RETURN true;
  END IF;
  
  -- Basic phone validation (digits, spaces, parentheses, hyphens, plus)
  RETURN phone ~ '^[\+]?[0-9\s\(\)\-]{10,20}$';
END;
$$;

-- Create validation trigger for profiles
CREATE OR REPLACE FUNCTION public.validate_profile_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate email format if provided
  IF NEW.email IS NOT NULL AND NOT public.validate_email(NEW.email) THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Validate phone format if provided
  IF NEW.phone IS NOT NULL AND NOT public.validate_phone(NEW.phone) THEN
    RAISE EXCEPTION 'Invalid phone number format';
  END IF;
  
  -- Validate role is one of allowed values
  IF NEW.role NOT IN ('master', 'discipler', 'disciple') THEN
    RAISE EXCEPTION 'Invalid role. Must be master, discipler, or disciple';
  END IF;
  
  -- Prevent role elevation without proper authorization
  -- Only masters can change roles, or during initial user creation
  IF TG_OP = 'UPDATE' AND OLD.role != NEW.role THEN
    IF get_current_user_role() != 'master' THEN
      RAISE EXCEPTION 'Only masters can change user roles';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Add the validation trigger
DROP TRIGGER IF EXISTS validate_profile_trigger ON public.profiles;
CREATE TRIGGER validate_profile_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_data();

-- Add content sanitization for text fields
CREATE OR REPLACE FUNCTION public.sanitize_text_content()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Sanitize content in discipleship notes
  IF TG_TABLE_NAME = 'discipleship_notes' THEN
    NEW.content = COALESCE(trim(NEW.content), '');
    NEW.observations = COALESCE(trim(NEW.observations), '');
    NEW.prayer_requests = COALESCE(trim(NEW.prayer_requests), '');
  END IF;
  
  -- Sanitize content in meeting reports
  IF TG_TABLE_NAME = 'meeting_reports' THEN
    NEW.title = COALESCE(trim(NEW.title), '');
    NEW.content = COALESCE(trim(NEW.content), '');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Add sanitization triggers
DROP TRIGGER IF EXISTS sanitize_discipleship_notes_trigger ON public.discipleship_notes;
CREATE TRIGGER sanitize_discipleship_notes_trigger
  BEFORE INSERT OR UPDATE ON public.discipleship_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.sanitize_text_content();

DROP TRIGGER IF EXISTS sanitize_meeting_reports_trigger ON public.meeting_reports;
CREATE TRIGGER sanitize_meeting_reports_trigger
  BEFORE INSERT OR UPDATE ON public.meeting_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.sanitize_text_content();