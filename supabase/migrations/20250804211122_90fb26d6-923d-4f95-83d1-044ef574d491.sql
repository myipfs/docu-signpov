-- Function to calculate and update user storage
CREATE OR REPLACE FUNCTION public.update_user_storage(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_storage_used bigint := 0;
BEGIN
  -- Calculate storage from documents (content length)
  SELECT COALESCE(SUM(LENGTH(content)), 0) INTO total_storage_used
  FROM documents 
  WHERE user_id = p_user_id;
  
  -- Add storage from signatures
  SELECT total_storage_used + COALESCE(SUM(LENGTH(signature_data)), 0) INTO total_storage_used
  FROM signatures 
  WHERE user_id = p_user_id;
  
  -- Update or insert profile
  INSERT INTO profiles (id, storage_used, storage_limit, is_premium)
  VALUES (p_user_id, total_storage_used, 524288000, false)
  ON CONFLICT (id) 
  DO UPDATE SET 
    storage_used = EXCLUDED.storage_used,
    updated_at = now();
END;
$$;

-- Function to update all users storage
CREATE OR REPLACE FUNCTION public.update_all_users_storage()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Only allow admins to run this
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  FOR user_record IN SELECT DISTINCT user_id FROM documents LOOP
    PERFORM public.update_user_storage(user_record.user_id);
  END LOOP;
  
  FOR user_record IN SELECT DISTINCT user_id FROM signatures LOOP
    PERFORM public.update_user_storage(user_record.user_id);
  END LOOP;
END;
$$;

-- Trigger to update storage when documents change
CREATE OR REPLACE FUNCTION public.handle_document_storage_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.update_user_storage(OLD.user_id);
    RETURN OLD;
  ELSE
    PERFORM public.update_user_storage(NEW.user_id);
    RETURN NEW;
  END IF;
END;
$$;

-- Trigger to update storage when signatures change
CREATE OR REPLACE FUNCTION public.handle_signature_storage_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.update_user_storage(OLD.user_id);
    RETURN OLD;
  ELSE
    PERFORM public.update_user_storage(NEW.user_id);
    RETURN NEW;
  END IF;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS document_storage_trigger ON documents;
CREATE TRIGGER document_storage_trigger
  AFTER INSERT OR UPDATE OR DELETE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_document_storage_update();

DROP TRIGGER IF EXISTS signature_storage_trigger ON signatures;
CREATE TRIGGER signature_storage_trigger
  AFTER INSERT OR UPDATE OR DELETE ON signatures
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_signature_storage_update();

-- Update all existing users' storage
SELECT public.update_all_users_storage();