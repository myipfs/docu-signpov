-- Add RLS policies for storage_history table
CREATE POLICY "Users can view their own storage history" 
ON public.storage_history 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all storage history" 
ON public.storage_history 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE user_id = auth.uid() AND is_active = true
));