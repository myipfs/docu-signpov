
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { SignatureCanvas } from './SignatureCanvas';
import { TypedSignature } from './TypedSignature';
import { UploadedSignature } from './UploadedSignature';
import { SavedSignatures } from './SavedSignatures';
import { SaveOptions } from './SaveOptions';

interface SignatureTabContentsProps {
  activeTab: 'draw' | 'type' | 'upload' | 'saved';
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
  savedSignatures: any[];
  selectedSignatureId: string | null;
  onSelectSignature: (id: string) => void;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  signatureDataUrl: string | null;
}

export function SignatureTabContents({
  activeTab,
  initialName,
  onDataUrlChange,
  onNameChange,
  isAuthenticated,
  saveToAccount,
  onSaveToAccountChange,
  signatureName,
  onSignatureNameChange,
  isDefault,
  onIsDefaultChange,
  savedSignatures,
  selectedSignatureId,
  onSelectSignature,
  onSetDefault,
  onDelete,
  isLoading,
  signatureDataUrl
}: SignatureTabContentsProps) {
  return (
    <>
      <TabsContent value="draw" className="mt-4">
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
      </TabsContent>
      
      <TabsContent value="type" className="mt-4">
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
      </TabsContent>
      
      <TabsContent value="upload" className="mt-4">
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
      </TabsContent>
      
      {isAuthenticated && (
        <TabsContent value="saved" className="mt-4">
          <SavedSignatures 
            signatures={savedSignatures}
            selectedSignatureId={selectedSignatureId}
            onSelectSignature={onSelectSignature}
            onSetDefault={onSetDefault}
            onDelete={onDelete}
            isLoading={isLoading}
          />
        </TabsContent>
      )}
    </>
  );
}
