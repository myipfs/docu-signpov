
export interface SavedDocument {
  id: string;
  title: string;
  content: string;
  template_id?: string;
  is_public?: boolean;
  created_at: string;
  updated_at: string;
  user_id?: string;
}
