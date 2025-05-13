
export interface TempEmail {
  id: string;
  temp_email: string;
  forwarding_to: string;
  created_at: string;
  expires_at: string;
  active: boolean;
  user_id: string;
}
