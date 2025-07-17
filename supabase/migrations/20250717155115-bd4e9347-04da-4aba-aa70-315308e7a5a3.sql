-- Create admin roles system
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'admin', 'moderator');

-- Create admin_users table to track admin permissions
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  role admin_role NOT NULL DEFAULT 'admin',
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users table
CREATE POLICY "Super admins can manage all admin users" 
ON public.admin_users 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.role = 'super_admin' 
    AND au.is_active = true
  )
);

CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.is_active = true
  )
);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = $1 
    AND is_active = true
  );
$$;

-- Create function to get admin role
CREATE OR REPLACE FUNCTION public.get_admin_role(user_id UUID DEFAULT auth.uid())
RETURNS admin_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.admin_users 
  WHERE user_id = $1 
  AND is_active = true
  LIMIT 1;
$$;

-- Create function for admin analytics
CREATE OR REPLACE FUNCTION public.get_admin_analytics()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM auth.users),
    'premium_users', (SELECT COUNT(*) FROM profiles WHERE is_premium = true),
    'total_documents', (SELECT COUNT(*) FROM documents),
    'total_signatures', (SELECT COUNT(*) FROM signatures),
    'total_temp_emails', (SELECT COUNT(*) FROM temporary_emails WHERE active = true),
    'storage_usage', (
      SELECT json_build_object(
        'total_used', COALESCE(SUM(storage_used), 0),
        'total_limit', COALESCE(SUM(storage_limit), 0)
      )
      FROM profiles
    ),
    'recent_signups', (
      SELECT COUNT(*) FROM auth.users 
      WHERE created_at >= NOW() - INTERVAL '30 days'
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Grant super admin access to signpov@gmail.com
INSERT INTO public.admin_users (user_id, email, role, granted_at)
SELECT 
  id, 
  email, 
  'super_admin'::admin_role,
  now()
FROM auth.users 
WHERE email = 'signpov@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
  role = 'super_admin'::admin_role,
  is_active = true,
  updated_at = now();