
-- Create a function to get user storage data
CREATE OR REPLACE FUNCTION get_user_storage_data()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_data json;
BEGIN
  SELECT json_build_object(
    'storage_used', p.storage_used,
    'storage_limit', p.storage_limit,
    'is_premium', p.is_premium
  ) INTO user_data
  FROM profiles p
  WHERE p.id = auth.uid();
  
  RETURN user_data;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_storage_data() TO authenticated;
