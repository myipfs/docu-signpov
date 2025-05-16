
import { useEncryption } from '@/hooks/useEncryption';
import { useSignatureState } from '@/hooks/signature/useSignatureState';
import { useSignatureLoading } from '@/hooks/signature/useSignatureLoading';
import { useSignatureSaving } from '@/hooks/signature/useSignatureSaving';
import { useSignatureManagement } from '@/hooks/signature/useSignatureManagement';

export function useSignature() {
  const { isAuthenticated } = useEncryption();
  const {
    savedSignatures,
    setSavedSignatures,
    isLoading,
    setIsLoading,
    selectedSignatureId,
    setSelectedSignatureId
  } = useSignatureState();
  
  const { loadSavedSignatures } = useSignatureLoading(
    setIsLoading, 
    setSavedSignatures, 
    setSelectedSignatureId
  );
  
  const { saveSignatureToDatabase } = useSignatureSaving(
    setIsLoading, 
    loadSavedSignatures
  );
  
  const { setSignatureAsDefault, deleteSignature } = useSignatureManagement(
    setIsLoading,
    loadSavedSignatures,
    setSelectedSignatureId,
    selectedSignatureId
  );

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
