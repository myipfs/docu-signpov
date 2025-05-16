
import React from 'react';
import { TypedSignature } from './TypedSignature';
import { SaveOptions } from './SaveOptions';

interface TypeSignatureTabProps {
  initialName: string;
  onDataUrlChange: (dataUrl: string | null) => void;
  onNameChange: (name: string) => void;
  isAuthenticated: boolean;
  saveToAccount: boolean;
  onSaveToAccountChange: (value: boolean) => void;
  signatureName: string;
  onSignatureNameChange: (name: string) => void;
  isDefault: boolean;
  onIsDefaultChange: (value: boolean) => void;
}

export function TypeSignatureTab({
  initialName,
  onDataUrlChange,
  onNameChange,
  isAuthenticated,
  saveToAccount,
  onSaveToAccountChange,
  signatureName,
  onSignatureNameChange,
  isDefault,
  onIsDefaultChange
}: TypeSignatureTabProps) {
  return (
    <>
      <TypedSignature 
        initialName={initialName}
        onDataUrlChange={onDataUrlChange}
        onNameChange={onNameChange}
      />
      
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
