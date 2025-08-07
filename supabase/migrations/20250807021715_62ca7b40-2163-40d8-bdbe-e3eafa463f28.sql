-- Enhance the admin storage management with additional features

-- Create function to get user activity statistics
CREATE OR REPLACE FUNCTION public.get_user_activity_stats()
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

  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM auth.users),
    'active_users', (
      SELECT COUNT(*) FROM profiles 
      WHERE last_activity_at > (now() - INTERVAL '30 days')
    ),
    'inactive_30_days', (
      SELECT COUNT(*) FROM profiles 
      WHERE last_activity_at <= (now() - INTERVAL '30 days') 
      AND last_activity_at > (now() - INTERVAL '90 days')
    ),
    'inactive_90_days', (
      SELECT COUNT(*) FROM profiles 
      WHERE last_activity_at <= (now() - INTERVAL '90 days')
      AND is_dormant = false
    ),
    'dormant_users', (
      SELECT COUNT(*) FROM profiles 
      WHERE is_dormant = true
    ),
    'users_with_storage', (
      SELECT COUNT(*) FROM profiles 
      WHERE storage_used > 0
    ),
    'total_storage_used', (
      SELECT COALESCE(SUM(storage_used), 0) FROM profiles
    )
  ) INTO result;
  
  RETURN result;
END;
$function$;

-- Create function to bulk delete storage for multiple users
CREATE OR REPLACE FUNCTION public.admin_bulk_clear_storage(p_user_ids uuid[])
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  total_deleted_docs INTEGER := 0;
  total_deleted_sigs INTEGER := 0;
  processed_users INTEGER := 0;
  user_id uuid;
  result JSON;
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  -- Process each user
  FOREACH user_id IN ARRAY p_user_ids
  LOOP
    -- Delete user documents
    DELETE FROM documents WHERE user_id = user_id;
    GET DIAGNOSTICS total_deleted_docs = total_deleted_docs + ROW_COUNT;

    -- Delete user signatures
    DELETE FROM signatures WHERE user_id = user_id;
    GET DIAGNOSTICS total_deleted_sigs = total_deleted_sigs + ROW_COUNT;

    -- Reset storage usage
    UPDATE profiles 
    SET 
      storage_used = 0,
      updated_at = now()
    WHERE id = user_id;
    
    processed_users = processed_users + 1;
  END LOOP;

  -- Return result
  SELECT json_build_object(
    'processed_users', processed_users,
    'total_deleted_documents', total_deleted_docs,
    'total_deleted_signatures', total_deleted_sigs,
    'timestamp', now()
  ) INTO result;

  RETURN result;
END;
$function$;

-- Create function to auto-mark users dormant based on inactivity with detailed reasons
CREATE OR REPLACE FUNCTION public.auto_mark_dormant_users()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  dormant_count INTEGER := 0;
  result JSON;
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  -- Mark users as dormant if no activity for 3+ months with detailed reasons
  UPDATE public.profiles 
  SET 
    is_dormant = true,
    dormant_reason = CASE
      WHEN last_activity_at IS NULL THEN 'No activity recorded since account creation'
      WHEN last_activity_at < (now() - INTERVAL '6 months') THEN 'Inactive for over 6 months'
      WHEN last_activity_at < (now() - INTERVAL '3 months') THEN 'Inactive for over 3 months'
      ELSE 'Marked as dormant by admin'
    END,
    updated_at = now()
  WHERE 
    (last_activity_at < (now() - INTERVAL '3 months') OR last_activity_at IS NULL)
    AND is_dormant = false;
    
  GET DIAGNOSTICS dormant_count = ROW_COUNT;

  -- Return result
  SELECT json_build_object(
    'marked_dormant', dormant_count,
    'timestamp', now(),
    'criteria', '3+ months of inactivity'
  ) INTO result;

  RETURN result;
END;
$function$;

-- Create function to get users by storage usage threshold
CREATE OR REPLACE FUNCTION public.get_users_by_storage_threshold(threshold_percentage numeric DEFAULT 90)
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

  SELECT json_agg(
    json_build_object(
      'user_id', p.id,
      'email', u.email,
      'storage_used', p.storage_used,
      'storage_limit', p.storage_limit,
      'usage_percentage', ROUND((p.storage_used::numeric / p.storage_limit::numeric) * 100, 2),
      'is_premium', p.is_premium,
      'last_activity_at', p.last_activity_at,
      'is_dormant', p.is_dormant
    )
    ORDER BY (p.storage_used::numeric / p.storage_limit::numeric) DESC
  ) INTO result
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.id
  WHERE (p.storage_used::numeric / p.storage_limit::numeric) * 100 >= threshold_percentage;
  
  RETURN COALESCE(result, '[]'::json);
END;
$function$;