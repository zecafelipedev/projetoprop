-- Allow profiles to be created without user_id for disciple management
-- We'll update the profiles table to allow creating disciples without auth users initially

-- Create a trigger to generate a UUID for user_id if not provided (for disciples managed by disciplers)
CREATE OR REPLACE FUNCTION public.generate_user_id_for_disciples()
RETURNS TRIGGER AS $$
BEGIN
  -- If no user_id is provided and role is disciple, generate a placeholder UUID
  IF NEW.user_id IS NULL AND NEW.role = 'disciple' THEN
    NEW.user_id = gen_random_uuid();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate user_id for disciples
CREATE TRIGGER auto_generate_user_id_for_disciples
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_user_id_for_disciples();