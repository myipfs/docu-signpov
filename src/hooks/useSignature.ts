
import { useState, useEffect } from 'react';
import { toast } from '@/utils/toast';
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
      console.log("Loading saved signatures");
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        console.log("No authenticated user found");
        toast({
          title: "Authentication required",
          description: "Please sign in to access your saved signatures",
          variant: "destructive"
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('signatures')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching signatures:", error);
        throw error;
      }
      
      console.log("Signatures fetched:", data?.length || 0);
      
      const decryptedSignatures = await Promise.all(
        (data || []).map(async (signature) => {
          try {
            console.log("Decrypting signature:", signature.id);
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
      console.log("Signatures processed:", decryptedSignatures?.length || 0);
      
      const defaultSignature = decryptedSignatures?.find(sig => sig.is_default);
      if (defaultSignature) {
        setSelectedSignatureId(defaultSignature.id);
      }
    } catch (error) {
      console.error('Error loading signatures:', error);
      toast({
        title: "Error",
        description: "Failed to load saved signatures",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveSignatureToDatabase = async (signatureDataUrl: string, signatureName: string, isDefault: boolean) => {
    try {
      setIsLoading(true);
      console.log("Saving signature to database");
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        console.error("No authenticated user found");
        toast({
          title: "Authentication Required",
          description: "Please log in to save signatures",
          variant: "destructive"
        });
        throw new Error('User not authenticated');
      }
      
      console.log("Encrypting signature data");
      const encryptedSignature = await encryptData(signatureDataUrl);
      
      if (isDefault) {
        console.log("Setting as default signature, resetting other defaults");
        await supabase
          .from('signatures')
          .update({ is_default: false })
          .eq('user_id', session.user.id);
      }
      
      console.log("Inserting signature into database");
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
      
      if (error) {
        console.error("Error inserting signature:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to save signature",
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Signature saved securely to your account"
      });
      
      await loadSavedSignatures();
      
    } catch (error: any) {
      console.error('Error saving signature:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save signature to your account",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const setSignatureAsDefault = async (signatureId: string) => {
    try {
      setIsLoading(true);
      console.log("Setting signature as default:", signatureId);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast({
          title: "Authentication Required",
          description: "Please log in to manage signatures",
          variant: "destructive"
        });
        return;
      }
      
      await supabase
        .from('signatures')
        .update({ is_default: false })
        .eq('user_id', session.user.id);
      
      const { error } = await supabase
        .from('signatures')
        .update({ is_default: true })
        .eq('id', signatureId)
        .eq('user_id', session.user.id);
      
      if (error) {
        console.error("Error updating default signature:", error);
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Default signature updated"
      });
      await loadSavedSignatures();
      
    } catch (error) {
      console.error('Error updating default signature:', error);
      toast({
        title: "Error",
        description: "Failed to update default signature",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteSignature = async (signatureId: string) => {
    try {
      setIsLoading(true);
      console.log("Deleting signature:", signatureId);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast({
          title: "Authentication Required",
          description: "Please log in to manage signatures",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from('signatures')
        .delete()
        .eq('id', signatureId)
        .eq('user_id', session.user.id);
      
      if (error) {
        console.error("Error deleting signature:", error);
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Signature deleted"
      });
      
      if (selectedSignatureId === signatureId) {
        setSelectedSignatureId(null);
      }
      
      await loadSavedSignatures();
      
    } catch (error) {
      console.error('Error deleting signature:', error);
      toast({
        title: "Error",
        description: "Failed to delete signature",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add useEffect to check authentication status
  useEffect(() => {
    if (isAuthenticated) {
      loadSavedSignatures();
    }
  }, [isAuthenticated]);

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
