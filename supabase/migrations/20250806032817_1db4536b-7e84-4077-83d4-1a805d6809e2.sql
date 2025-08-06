-- Add dormant status and last activity tracking to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS is_dormant BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS dormant_reason TEXT;

-- Create index for efficient dormant user queries
CREATE INDEX IF NOT EXISTS idx_profiles_last_activity ON public.profiles(last_activity_at);
CREATE INDEX IF NOT EXISTS idx_profiles_dormant ON public.profiles(is_dormant);

-- Function to mark users as dormant if inactive for 3+ months
CREATE OR REPLACE FUNCTION public.mark_dormant_users()
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

  -- Mark users as dormant if no activity for 3+ months
  UPDATE public.profiles 
  SET 
    is_dormant = true,
    dormant_reason = 'Inactive for over 3 months',
    updated_at = now()
  WHERE 
    last_activity_at < (now() - INTERVAL '3 months')
    AND is_dormant = false;
    
  GET DIAGNOSTICS dormant_count = ROW_COUNT;

  -- Return result
  SELECT json_build_object(
    'marked_dormant', dormant_count,
    'timestamp', now()
  ) INTO result;

  RETURN result;
END;
$function$;

-- Function to clear user storage (admin only)
CREATE OR REPLACE FUNCTION public.admin_clear_user_storage(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  deleted_docs INTEGER := 0;
  deleted_sigs INTEGER := 0;
  result JSON;
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  -- Delete user documents
  DELETE FROM documents WHERE user_id = p_user_id;
  GET DIAGNOSTICS deleted_docs = ROW_COUNT;

  -- Delete user signatures
  DELETE FROM signatures WHERE user_id = p_user_id;
  GET DIAGNOSTICS deleted_sigs = ROW_COUNT;

  -- Reset storage usage
  UPDATE profiles 
  SET 
    storage_used = 0,
    updated_at = now()
  WHERE id = p_user_id;

  -- Return result
  SELECT json_build_object(
    'user_id', p_user_id,
    'deleted_documents', deleted_docs,
    'deleted_signatures', deleted_sigs,
    'storage_cleared', true,
    'timestamp', now()
  ) INTO result;

  RETURN result;
END;
$function$;

-- Function to reactivate dormant users
CREATE OR REPLACE FUNCTION public.admin_reactivate_user(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  -- Reactivate user
  UPDATE public.profiles 
  SET 
    is_dormant = false,
    dormant_reason = null,
    last_activity_at = now(),
    updated_at = now()
  WHERE id = p_user_id;

  RETURN true;
END;
$function$;

-- Function to get dormant users list
CREATE OR REPLACE FUNCTION public.get_dormant_users()
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
      'id', u.id,
      'email', u.email,
      'last_activity_at', p.last_activity_at,
      'dormant_reason', p.dormant_reason,
      'storage_used', p.storage_used,
      'is_premium', p.is_premium,
      'created_at', u.created_at
    )
    ORDER BY p.last_activity_at ASC
  ) INTO result
  FROM auth.users u
  JOIN public.profiles p ON u.id = p.id
  WHERE p.is_dormant = true;
  
  RETURN COALESCE(result, '[]'::json);
END;
$function$;

-- Update activity tracking trigger
CREATE OR REPLACE FUNCTION public.update_user_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Update last activity when user creates/updates documents or signatures
  UPDATE public.profiles 
  SET 
    last_activity_at = now(),
    is_dormant = false,
    dormant_reason = null
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$function$;

-- Create triggers to track user activity
DROP TRIGGER IF EXISTS update_activity_on_document ON documents;
CREATE TRIGGER update_activity_on_document
  AFTER INSERT OR UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION public.update_user_activity();

DROP TRIGGER IF EXISTS update_activity_on_signature ON signatures;
CREATE TRIGGER update_activity_on_signature
  AFTER INSERT OR UPDATE ON signatures
  FOR EACH ROW EXECUTE FUNCTION public.update_user_activity();