
import React from 'react';
import { UploadedSignature } from './UploadedSignature';
import { SaveOptions } from './SaveOptions';

interface UploadSignatureTabProps {
  onDataUrlChange: (dataUrl: string | null) => void;
  isAuthenticated: boolean;
  saveToAccount: boolean;
  onSaveToAccountChange: (value: boolean) => void;
  signatureName: string;
  onSignatureNameChange: (name: string) => void;
  isDefault: boolean;
  onIsDefaultChange: (value: boolean) => void;
  signatureDataUrl: string | null;
}

export function UploadSignatureTab({
  onDataUrlChange,
  isAuthenticated,
  saveToAccount,
  onSaveToAccountChange,
  signatureName,
  onSignatureNameChange,
  isDefault,
  onIsDefaultChange,
  signatureDataUrl
}: UploadSignatureTabProps) {
  return (
    <>
      <UploadedSignature onDataUrlChange={onDataUrlChange} />
      
      {isAuthenticated && signatureDataUrl && (
        <SaveOptions 
          isAuthenticated={isAuthenticated}
          saveToAccount={saveToAccount}
          onSaveToAccountChange={onSaveToAccountChange}
          signatureName={signatureName}
          onSignatureNameChange={onSignatureNameChange}
          isDefault={isDefault}
          onIsDefaultChange={onIsDefaultChange}
        />
      )}
    </>
  );
}
