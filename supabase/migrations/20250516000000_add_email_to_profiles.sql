
-- Add email field to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Update existing profiles with email from auth.users
UPDATE public.profiles 
SET email = auth.users.email 
FROM auth.users 
WHERE profiles.id = auth.users.id;

-- Modify the handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name');
  RETURN new;
END;
$$;
