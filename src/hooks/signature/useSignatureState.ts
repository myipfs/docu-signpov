
import { useState } from 'react';
import { SavedSignature } from '@/types/signatures';

export function useSignatureState() {
  const [savedSignatures, setSavedSignatures] = useState<SavedSignature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSignatureId, setSelectedSignatureId] = useState<string | null>(null);

  return {
    savedSignatures,
    setSavedSignatures,
    isLoading,
    setIsLoading,
    selectedSignatureId,
    setSelectedSignatureId
  };
}
