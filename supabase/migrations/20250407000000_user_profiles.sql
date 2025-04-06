
-- Update documents table to track document size
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS file_size BIGINT DEFAULT 0 NOT NULL;

-- RLS policy to ensure users can't exceed their storage limit
CREATE POLICY "Check storage limit before insert" 
  ON public.documents 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    (SELECT (storage_used + file_size <= storage_limit) FROM public.profiles WHERE id = auth.uid())
  );

-- Function to update storage usage when documents are added/removed
CREATE OR REPLACE FUNCTION public.update_storage_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles 
    SET storage_used = storage_used + NEW.file_size
    WHERE id = NEW.user_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles 
    SET storage_used = storage_used - OLD.file_size
    WHERE id = OLD.user_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' AND NEW.file_size <> OLD.file_size THEN
    UPDATE public.profiles 
    SET storage_used = storage_used - OLD.file_size + NEW.file_size
    WHERE id = NEW.user_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to update storage usage
CREATE TRIGGER update_storage_on_insert
  AFTER INSERT ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_storage_usage();

CREATE TRIGGER update_storage_on_delete
  AFTER DELETE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_storage_usage();

CREATE TRIGGER update_storage_on_update
  AFTER UPDATE ON public.documents
  FOR EACH ROW WHEN (NEW.file_size <> OLD.file_size)
  EXECUTE FUNCTION public.update_storage_usage();
