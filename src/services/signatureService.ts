
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/utils/toast';
import { SavedSignature } from '@/types/signatures';

export async function fetchUserSignatures(userId: string): Promise<SavedSignature[]> {
  try {
    console.log("Fetching signatures for user:", userId);
    
    const { data, error } = await supabase
      .from('signatures')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching signatures:", error);
      throw error;
    }
    
    console.log("Signatures fetched:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error in fetchUserSignatures:', error);
    throw error;
  }
}

export async function saveSignature(
  userId: string,
  encryptedSignature: string,
  signatureName: string,
  isDefault: boolean
): Promise<SavedSignature> {
  try {
    console.log("Saving signature to database for user:", userId);
    
    if (isDefault) {
      console.log("Setting as default signature, resetting other defaults");
      await supabase
        .from('signatures')
        .update({ is_default: false })
        .eq('user_id', userId);
    }
    
    console.log("Inserting signature into database");
    const { data, error } = await supabase
      .from('signatures')
      .insert({
        signature_data: encryptedSignature,
        name: signatureName || null,
        is_default: isDefault,
        user_id: userId
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error inserting signature:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in saveSignature:', error);
    throw error;
  }
}

export async function updateSignatureDefault(userId: string, signatureId: string): Promise<void> {
  try {
    console.log("Setting signature as default:", signatureId);
    
    await supabase
      .from('signatures')
      .update({ is_default: false })
      .eq('user_id', userId);
    
    const { error } = await supabase
      .from('signatures')
      .update({ is_default: true })
      .eq('id', signatureId)
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error updating default signature:", error);
      throw error;
    }
  } catch (error) {
    console.error('Error in updateSignatureDefault:', error);
    throw error;
  }
}

export async function deleteUserSignature(userId: string, signatureId: string): Promise<void> {
  try {
    console.log("Deleting signature:", signatureId);
    
    const { error } = await supabase
      .from('signatures')
      .delete()
      .eq('id', signatureId)
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error deleting signature:", error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteUserSignature:', error);
    throw error;
  }
}
