-- Fix the get_all_users_admin function to resolve GROUP BY issue
CREATE OR REPLACE FUNCTION public.get_all_users_admin()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  result JSON;
BEGIN
  -- Check if user is admin using the simpler is_admin function
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  -- Fetch all users with profile data - fixed SQL query
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
    ORDER BY u.created_at DESC
  ) INTO result
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  LEFT JOIN public.admin_users au ON u.id = au.user_id AND au.is_active = true;
  
  RETURN COALESCE(result, '[]'::json);
END;
$function$;