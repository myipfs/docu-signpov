
import { supabase } from "@/integrations/supabase/client";

export const generateTempEmail = () => {
  const random = Math.random().toString(36).substring(2, 10);
  return `temp-${random}@signdocs.temp`;
};

export const createTemporaryEmail = async (forwardingTo: string) => {
  try {
    console.log("Creating temporary email for:", forwardingTo);
    const tempEmail = generateTempEmail();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // Expires in 30 days

    // Make sure to include all required fields and set active to true explicitly
    const { data, error } = await supabase
      .from('temporary_emails')
      .insert({
        temp_email: tempEmail,
        forwarding_to: forwardingTo,
        expires_at: expiryDate.toISOString(),
        active: true
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating temp email:", error);
      throw new Error(`Failed to create temporary email: ${error.message}`);
    }
    
    console.log("Successfully created temporary email:", data);
    
    // Add to localStorage to help remember temp emails
    try {
      const existingEmails = JSON.parse(localStorage.getItem('tempEmails') || '[]');
      localStorage.setItem('tempEmails', JSON.stringify([...existingEmails, data]));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
    
    return data;
  } catch (error) {
    console.error("Temp email creation failed:", error);
    throw error;
  }
};

export const getUserTemporaryEmails = async () => {
  try {
    console.log("Fetching temporary emails...");
    const { data, error } = await supabase
      .from('temporary_emails')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching temp emails:", error);
      throw new Error(`Failed to fetch temporary emails: ${error.message}`);
    }

    console.log("Fetched emails:", data);
    return data;
  } catch (error) {
    console.error("Error in getUserTemporaryEmails:", error);
    throw error;
  }
};

export const deleteTemporaryEmail = async (id: string) => {
  try {
    console.log("Deleting temporary email with ID:", id);
    const { error } = await supabase
      .from('temporary_emails')
      .update({ active: false })
      .eq('id', id);

    if (error) {
      console.error("Error deleting temp email:", error);
      throw new Error(`Failed to delete temporary email: ${error.message}`);
    }
    
    console.log("Successfully deleted temporary email with ID:", id);
    
    // Remove from localStorage
    try {
      const existingEmails = JSON.parse(localStorage.getItem('tempEmails') || '[]');
      const updatedEmails = existingEmails.filter((email: any) => email.id !== id);
      localStorage.setItem('tempEmails', JSON.stringify(updatedEmails));
    } catch (e) {
      console.error("Error updating localStorage:", e);
    }
  } catch (error) {
    console.error("Error in deleteTemporaryEmail:", error);
    throw error;
  }
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
    .catch(err => console.error('Failed to copy text: ', err));
};
