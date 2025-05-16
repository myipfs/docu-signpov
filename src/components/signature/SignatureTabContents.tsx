
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { DrawSignatureTab } from './DrawSignatureTab';
import { TypeSignatureTab } from './TypeSignatureTab';
import { UploadSignatureTab } from './UploadSignatureTab';
import { SavedSignaturesTab } from './SavedSignaturesTab';

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
        <DrawSignatureTab
          onDataUrlChange={onDataUrlChange}
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
        <TypeSignatureTab 
          initialName={initialName}
          onDataUrlChange={onDataUrlChange}
          onNameChange={onNameChange}
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
        <UploadSignatureTab 
          onDataUrlChange={onDataUrlChange}
          isAuthenticated={isAuthenticated}
          saveToAccount={saveToAccount}
          onSaveToAccountChange={onSaveToAccountChange}
          signatureName={signatureName}
          onSignatureNameChange={onSignatureNameChange}
          isDefault={isDefault}
          onIsDefaultChange={onIsDefaultChange}
          signatureDataUrl={signatureDataUrl}
        />
      </TabsContent>
      
      {isAuthenticated && (
        <TabsContent value="saved" className="mt-4">
          <SavedSignaturesTab 
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
