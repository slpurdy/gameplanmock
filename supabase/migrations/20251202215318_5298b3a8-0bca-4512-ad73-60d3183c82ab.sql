-- Remove email column from profiles table to prevent exposure to team members
-- Email is already stored securely in auth.users and should be accessed there if needed
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- Update the handle_new_user function to not copy email to profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$;