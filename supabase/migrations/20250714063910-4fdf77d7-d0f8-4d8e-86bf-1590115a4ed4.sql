
-- Update the get_and_track_storage function to include proper search_path
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
$function$
