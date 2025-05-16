
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/utils/toast';
import { updateSignatureDefault, deleteUserSignature } from '@/services/signatureService';

export function useSignatureManagement(
  setIsLoading: (isLoading: boolean) => void,
  loadSavedSignatures: () => Promise<void>,
  setSelectedSignatureId: (id: string | null) => void,
  selectedSignatureId: string | null
) {
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
  
  return { setSignatureAsDefault, deleteSignature };
}
