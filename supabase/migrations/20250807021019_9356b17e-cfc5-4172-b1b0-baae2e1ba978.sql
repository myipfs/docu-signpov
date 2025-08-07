-- Update the get_all_users_admin function to ensure email data is properly returned
CREATE OR REPLACE FUNCTION public.get_all_users_admin()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  result JSON;
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  -- Fetch all users with profile data and ensure email is included
  SELECT json_agg(
    json_build_object(
      'id', u.id,
      'email', COALESCE(u.email, 'No email'),
      'created_at', u.created_at,
      'is_premium', COALESCE(p.is_premium, false),
      'storage_used', COALESCE(p.storage_used, 0),
      'storage_limit', COALESCE(p.storage_limit, 524288000),
      'last_activity_at', p.last_activity_at,
      'is_dormant', COALESCE(p.is_dormant, false),
      'dormant_reason', p.dormant_reason,
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