
import { useState } from 'react';
import { toast } from '@/utils/toast';
import { signatureEncryption } from '@/utils/encryption';
import { supabase } from '@/integrations/supabase/client';
import { useEncryption } from '@/hooks/useEncryption';

export interface SavedSignature {
  id: string;
  signature_data: string;
  name: string | null;
  is_default: boolean | null;
}

export function useSignature() {
  const [savedSignatures, setSavedSignatures] = useState<SavedSignature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSignatureId, setSelectedSignatureId] = useState<string | null>(null);
  const { encryptData, decryptData, isAuthenticated } = useEncryption();

  const loadSavedSignatures = async () => {
    try {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('signatures')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const decryptedSignatures = await Promise.all(
        (data || []).map(async (signature) => {
          try {
            const decryptedData = await decryptData(signature.signature_data);
            return {
              ...signature,
              signature_data: decryptedData
            };
          } catch (decryptError) {
            console.error('Failed to decrypt signature:', decryptError);
            return {
              ...signature,
              signature_data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iNTAiPjx0ZXh0IHg9IjEwIiB5PSIzMCIgZmlsbD0icmVkIj5EZWNyeXB0aW9uIGVycm9yPC90ZXh0Pjwvc3ZnPg=='
            };
          }
        })
      );
      
      setSavedSignatures(decryptedSignatures || []);
      
      const defaultSignature = decryptedSignatures?.find(sig => sig.is_default);
      if (defaultSignature) {
        setSelectedSignatureId(defaultSignature.id);
      }
    } catch (error) {
      console.error('Error loading signatures:', error);
      toast.error('Failed to load saved signatures');
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveSignatureToDatabase = async (signatureDataUrl: string, signatureName: string, isDefault: boolean) => {
    try {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }
      
      const encryptedSignature = await encryptData(signatureDataUrl);
      
      if (isDefault) {
        await supabase
          .from('signatures')
          .update({ is_default: false })
          .not('id', 'is', null);
      }
      
      const { data, error } = await supabase
        .from('signatures')
        .insert({
          signature_data: encryptedSignature,
          name: signatureName || null,
          is_default: isDefault,
          user_id: session.user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Signature saved securely to your account');
      
      await loadSavedSignatures();
      
    } catch (error) {
      console.error('Error saving signature:', error);
      toast.error('Failed to save signature to your account');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const setSignatureAsDefault = async (signatureId: string) => {
    try {
      setIsLoading(true);
      
      await supabase
        .from('signatures')
        .update({ is_default: false })
        .not('id', 'is', null);
      
      const { error } = await supabase
        .from('signatures')
        .update({ is_default: true })
        .eq('id', signatureId);
      
      if (error) throw error;
      
      toast.success('Default signature updated');
      await loadSavedSignatures();
      
    } catch (error) {
      console.error('Error updating default signature:', error);
      toast.error('Failed to update default signature');
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteSignature = async (signatureId: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('signatures')
        .delete()
        .eq('id', signatureId);
      
      if (error) throw error;
      
      toast.success('Signature deleted');
      
      if (selectedSignatureId === signatureId) {
        setSelectedSignatureId(null);
      }
      
      await loadSavedSignatures();
      
    } catch (error) {
      console.error('Error deleting signature:', error);
      toast.error('Failed to delete signature');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    savedSignatures,
    isLoading,
    selectedSignatureId,
    setSelectedSignatureId,
    loadSavedSignatures,
    saveSignatureToDatabase,
    setSignatureAsDefault,
    deleteSignature,
    isAuthenticated
  };
}
