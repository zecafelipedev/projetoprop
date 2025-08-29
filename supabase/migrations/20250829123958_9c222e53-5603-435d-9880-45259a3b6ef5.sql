-- Ensure profiles are created for new and existing users

-- 1) Create trigger to auto-insert profile when a new auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- 2) Backfill: create profiles for existing auth users without a profile
INSERT INTO public.profiles (user_id, name, email, role)
SELECT u.id,
       COALESCE(u.raw_user_meta_data->>'name', u.email) AS name,
       u.email,
       'disciple'::text AS role
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.user_id IS NULL;