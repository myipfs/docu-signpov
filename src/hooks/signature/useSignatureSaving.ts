
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/utils/toast';
import { useEncryption } from '@/hooks/useEncryption';
import { saveSignature } from '@/services/signatureService';

export function useSignatureSaving(
  setIsLoading: (isLoading: boolean) => void,
  loadSavedSignatures: () => Promise<void>
) {
  const { encryptData } = useEncryption();
  
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
  
  return { saveSignatureToDatabase };
}
