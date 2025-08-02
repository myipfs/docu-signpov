-- Create notifications table for site-wide and user-specific notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
  is_site_wide BOOLEAN NOT NULL DEFAULT false,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can read notifications sent to them or site-wide notifications
CREATE POLICY "Users can read their notifications" ON public.notifications
FOR SELECT
USING (
  target_user_id = auth.uid() OR 
  (is_site_wide = true AND target_user_id IS NULL)
);

-- Users can mark their notifications as read
CREATE POLICY "Users can update their notification read status" ON public.notifications
FOR UPDATE
USING (target_user_id = auth.uid())
WITH CHECK (target_user_id = auth.uid());

-- Only admins can create notifications
CREATE POLICY "Admins can create notifications" ON public.notifications
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Create indexes for better performance
CREATE INDEX idx_notifications_target_user ON public.notifications(target_user_id);
CREATE INDEX idx_notifications_site_wide ON public.notifications(is_site_wide) WHERE is_site_wide = true;
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Create function to send notifications
CREATE OR REPLACE FUNCTION public.send_notification(
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'info',
  p_is_site_wide BOOLEAN DEFAULT false,
  p_target_user_id UUID DEFAULT NULL,
  p_expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  -- Insert notification
  INSERT INTO public.notifications (
    title, message, type, is_site_wide, target_user_id, sender_id, expires_at
  ) VALUES (
    p_title, p_message, p_type, p_is_site_wide, p_target_user_id, auth.uid(), p_expires_at
  ) RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$;

-- Create function to get admin document analytics
CREATE OR REPLACE FUNCTION public.get_admin_document_analytics()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  SELECT json_build_object(
    'total_documents', (SELECT COUNT(*) FROM documents),
    'public_documents', (SELECT COUNT(*) FROM documents WHERE is_public = true),
    'private_documents', (SELECT COUNT(*) FROM documents WHERE is_public = false),
    'documents_by_user', (
      SELECT json_agg(
        json_build_object(
          'user_email', u.email,
          'user_id', d.user_id,
          'document_count', doc_count,
          'total_size', COALESCE(storage_used, 0)
        )
      )
      FROM (
        SELECT user_id, COUNT(*) as doc_count
        FROM documents 
        GROUP BY user_id
      ) d
      JOIN auth.users u ON u.id = d.user_id
      LEFT JOIN profiles p ON p.id = d.user_id
      ORDER BY doc_count DESC
      LIMIT 20
    ),
    'recent_documents', (
      SELECT json_agg(
        json_build_object(
          'id', d.id,
          'title', d.title,
          'user_email', u.email,
          'created_at', d.created_at,
          'is_public', d.is_public
        )
      )
      FROM documents d
      JOIN auth.users u ON u.id = d.user_id
      ORDER BY d.created_at DESC
      LIMIT 10
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- Create function to delete user documents (admin only)
CREATE OR REPLACE FUNCTION public.admin_delete_user_documents(
  p_user_id UUID,
  p_document_ids UUID[] DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER := 0;
  result JSON;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  -- Delete specific documents or all documents for the user
  IF p_document_ids IS NOT NULL THEN
    DELETE FROM documents 
    WHERE user_id = p_user_id AND id = ANY(p_document_ids);
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
  ELSE
    DELETE FROM documents WHERE user_id = p_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
  END IF;

  -- Return result
  SELECT json_build_object(
    'deleted_count', deleted_count,
    'user_id', p_user_id,
    'timestamp', now()
  ) INTO result;

  RETURN result;
END;
$$;