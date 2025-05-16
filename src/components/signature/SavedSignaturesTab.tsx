
import React from 'react';
import { SavedSignatures } from './SavedSignatures';
import { SavedSignature } from '@/types/signatures';

interface SavedSignaturesTabProps {
  signatures: SavedSignature[];
  selectedSignatureId: string | null;
  onSelectSignature: (id: string) => void;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function SavedSignaturesTab({
  signatures,
  selectedSignatureId,
  onSelectSignature,
  onSetDefault,
  onDelete,
  isLoading
}: SavedSignaturesTabProps) {
  return (
    <SavedSignatures 
      signatures={signatures}
      selectedSignatureId={selectedSignatureId}
      onSelectSignature={onSelectSignature}
      onSetDefault={onSetDefault}
      onDelete={onDelete}
      isLoading={isLoading}
    />
  );
}
