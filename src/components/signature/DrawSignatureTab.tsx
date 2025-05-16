
import React from 'react';
import { SignatureCanvas } from './SignatureCanvas';
import { SaveOptions } from './SaveOptions';

interface DrawSignatureTabProps {
  onDataUrlChange: (dataUrl: string | null) => void;
  isAuthenticated: boolean;
  saveToAccount: boolean;
  onSaveToAccountChange: (value: boolean) => void;
  signatureName: string;
  onSignatureNameChange: (name: string) => void;
  isDefault: boolean;
  onIsDefaultChange: (value: boolean) => void;
}

export function DrawSignatureTab({
  onDataUrlChange,
  isAuthenticated,
  saveToAccount,
  onSaveToAccountChange,
  signatureName,
  onSignatureNameChange,
  isDefault,
  onIsDefaultChange
}: DrawSignatureTabProps) {
  return (
    <>
      <SignatureCanvas onDataUrlChange={onDataUrlChange} />
      
      <SaveOptions 
        isAuthenticated={isAuthenticated}
        saveToAccount={saveToAccount}
        onSaveToAccountChange={onSaveToAccountChange}
        signatureName={signatureName}
        onSignatureNameChange={onSignatureNameChange}
        isDefault={isDefault}
        onIsDefaultChange={onIsDefaultChange}
      />
    </>
  );
}
