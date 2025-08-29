-- Fix function search path security warnings

-- Update validate_email function with proper search_path
CREATE OR REPLACE FUNCTION public.validate_email(email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

-- Update validate_phone function with proper search_path
CREATE OR REPLACE FUNCTION public.validate_phone(phone text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Update validate_profile_data function with proper search_path
CREATE OR REPLACE FUNCTION public.validate_profile_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Update sanitize_text_content function with proper search_path
CREATE OR REPLACE FUNCTION public.sanitize_text_content()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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