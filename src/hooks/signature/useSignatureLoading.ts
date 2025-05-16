
import { useState, useEffect } from 'react';
import { toast } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';
import { useEncryption } from '@/hooks/useEncryption';
import { SavedSignature } from '@/types/signatures';
import { fetchUserSignatures } from '@/services/signatureService';

export function useSignatureLoading(
  setIsLoading: (isLoading: boolean) => void,
  setSavedSignatures: (signatures: SavedSignature[]) => void,
  setSelectedSignatureId: (id: string | null) => void
) {
  const { decryptData, isAuthenticated } = useEncryption();
  
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
  
  // Add useEffect to check authentication status
  useEffect(() => {
    if (isAuthenticated) {
      loadSavedSignatures();
    }
  }, [isAuthenticated]);

  return { loadSavedSignatures };
}
