-- Fix the remaining functions that need search_path

CREATE OR REPLACE FUNCTION public.get_admin_analytics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_all_users_admin()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.update_user_premium_status(target_user_id uuid, new_premium_status boolean)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;