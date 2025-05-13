
import { useState, useEffect } from 'react';
import { toast } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';
import { useEncryption } from '@/hooks/useEncryption';
import { SavedSignature } from '@/types/signatures';
import { 
  fetchUserSignatures,
  saveSignature,
  updateSignatureDefault,
  deleteUserSignature
} from '@/services/signatureService';

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
      
      const signatures = await fetchUserSignatures(session.user.id);
      
      const decryptedSignatures = await Promise.all(
        signatures.map(async (signature) => {
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
      
      await saveSignature(
        session.user.id,
        encryptedSignature,
        signatureName,
        isDefault
      );
      
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
      
      await updateSignatureDefault(session.user.id, signatureId);
      
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
      
      await deleteUserSignature(session.user.id, signatureId);
      
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
