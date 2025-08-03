-- Fix security warnings by updating function search paths

-- Update functions that are missing search_path
CREATE OR REPLACE FUNCTION public.get_and_track_storage(user_id uuid)
RETURNS TABLE(total_storage bigint, used_storage bigint, document_count integer, signatures_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Get current data
  RETURN QUERY
  SELECT * FROM get_user_storage_data_v2(user_id);
  
  -- Record history
  INSERT INTO storage_history (
    user_id, 
    total_storage, 
    used_storage,
    document_count,
    signatures_count
  )
  SELECT 
    user_id,
    total_storage,
    used_storage,
    document_count,
    signatures_count
  FROM get_user_storage_data_v2(user_id);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_storage_data_v2(user_id uuid)
RETURNS TABLE(total_storage bigint, used_storage bigint, document_count integer, signatures_count integer, storage_buckets text[])
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  storage_used BIGINT := 0;
BEGIN
  -- Calculate from Supabase Storage
  SELECT COALESCE(SUM(objects.size), 0) INTO storage_used
  FROM storage.objects
  WHERE owner_id = user_id 
    AND bucket_id IN ('documents', 'signatures');
  
  -- Get counts from database tables
  RETURN QUERY
  SELECT
    100 * 1024 * 1024 AS total_storage, -- 100MB default
    storage_used AS used_storage,
    (SELECT COUNT(*) FROM documents WHERE user_id = get_user_storage_data_v2.user_id)::integer AS document_count,
    (SELECT COUNT(*) FROM signatures WHERE user_id = get_user_storage_data_v2.user_id)::integer AS signatures_count,
    ARRAY['documents', 'signatures'] AS storage_buckets;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    -- Function logic here
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_admin_role(user_id uuid DEFAULT auth.uid())
RETURNS admin_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT role FROM public.admin_users 
  WHERE user_id = $1 
  AND is_active = true
  LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = $1 
    AND is_active = true
  );
$function$;