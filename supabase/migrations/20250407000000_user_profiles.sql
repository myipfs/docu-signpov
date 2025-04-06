
-- Create a profiles table to store user metadata
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  storage_used BIGINT DEFAULT 0 NOT NULL,
  storage_limit BIGINT DEFAULT 524288000 NOT NULL, -- 500MB in bytes
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own profile
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, storage_limit, is_premium)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'storage_limit')::BIGINT, 524288000), -- 500MB default
    COALESCE((NEW.raw_user_meta_data->>'is_premium')::BOOLEAN, FALSE)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create a profile for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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
