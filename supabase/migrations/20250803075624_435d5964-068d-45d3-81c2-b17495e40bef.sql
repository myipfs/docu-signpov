-- Add admin users with super admin privileges
INSERT INTO public.admin_users (user_id, email, role, is_active, granted_at) 
VALUES 
  -- We need to get the actual user_id from auth.users, but for now we'll use a function
  -- that will handle this properly
  (
    (SELECT id FROM auth.users WHERE email = 'support@signpov.com'),
    'support@signpov.com',
    'super_admin',
    true,
    now()
  ),
  (
    (SELECT id FROM auth.users WHERE email = 'signpov@gmail.com'),
    'signpov@gmail.com', 
    'super_admin',
    true,
    now()
  )
ON CONFLICT (user_id) DO UPDATE SET
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Create a function to ensure admin users get added when they sign up
CREATE OR REPLACE FUNCTION public.ensure_admin_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the user's email is in our admin list
  IF NEW.email IN ('support@signpov.com', 'signpov@gmail.com') THEN
    -- Insert into admin_users table
    INSERT INTO public.admin_users (user_id, email, role, is_active)
    VALUES (NEW.id, NEW.email, 'super_admin', true)
    ON CONFLICT (user_id) DO UPDATE SET
      role = EXCLUDED.role,
      is_active = EXCLUDED.is_active,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically add admin users when they sign up
DROP TRIGGER IF EXISTS ensure_admin_user_trigger ON auth.users;
CREATE TRIGGER ensure_admin_user_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_admin_user();