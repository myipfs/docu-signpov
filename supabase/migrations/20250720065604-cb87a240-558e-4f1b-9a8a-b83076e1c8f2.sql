-- Fix infinite recursion in admin_users RLS policies
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage all admin users" ON public.admin_users;

-- Create safer RLS policies that don't cause recursion
CREATE POLICY "Admins can view admin users v2" 
ON public.admin_users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.is_active = true
    AND au.email = (
      SELECT email FROM auth.users 
      WHERE id = auth.uid()
    )
  )
);

CREATE POLICY "Super admins can manage all admin users v2" 
ON public.admin_users 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.role = 'super_admin'::admin_role 
    AND au.is_active = true
    AND au.email = (
      SELECT email FROM auth.users 
      WHERE id = auth.uid()
    )
  )
);

-- Create RPC function to fetch all users for admin dashboard
CREATE OR REPLACE FUNCTION public.get_all_users_admin()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Check if user is admin using the simpler is_admin function
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  -- Fetch all users with profile data
  SELECT json_agg(
    json_build_object(
      'id', u.id,
      'email', u.email,
      'created_at', u.created_at,
      'is_premium', COALESCE(p.is_premium, false),
      'storage_used', COALESCE(p.storage_used, 0),
      'storage_limit', COALESCE(p.storage_limit, 524288000),
      'admin_role', au.role
    )
  ) INTO result
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  LEFT JOIN public.admin_users au ON u.id = au.user_id AND au.is_active = true
  ORDER BY u.created_at DESC;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- Create RPC function to update user premium status
CREATE OR REPLACE FUNCTION public.update_user_premium_status(
  target_user_id UUID,
  new_premium_status BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  -- Update the user's premium status
  UPDATE public.profiles 
  SET 
    is_premium = new_premium_status,
    storage_limit = CASE 
      WHEN new_premium_status THEN 1073741824 -- 1GB for premium
      ELSE 524288000 -- 500MB for free
    END,
    updated_at = now()
  WHERE id = target_user_id;

  -- If no profile exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, is_premium, storage_limit, storage_used)
    VALUES (
      target_user_id, 
      new_premium_status,
      CASE WHEN new_premium_status THEN 1073741824 ELSE 524288000 END,
      0
    );
  END IF;

  RETURN true;
END;
$$;