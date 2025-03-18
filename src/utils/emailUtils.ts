
import { supabase } from "@/integrations/supabase/client";

export const generateTempEmail = () => {
  const random = Math.random().toString(36).substring(2, 10);
  return `temp-${random}@signdocs.temp`;
};

export const createTemporaryEmail = async (forwardingTo: string) => {
  const tempEmail = generateTempEmail();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30); // Expires in 30 days

  const { data, error } = await supabase
    .from('temporary_emails')
    .insert({
      temp_email: tempEmail,
      forwarding_to: forwardingTo,
      expires_at: expiryDate.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserTemporaryEmails = async () => {
  const { data, error } = await supabase
    .from('temporary_emails')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const deleteTemporaryEmail = async (id: string) => {
  const { error } = await supabase
    .from('temporary_emails')
    .delete()
    .match({ id });

  if (error) throw error;
};
