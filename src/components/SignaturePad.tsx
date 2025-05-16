
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useSignature } from '@/hooks/useSignature';
import { supabase } from '@/integrations/supabase/client';

import { SignatureModalHeader } from './signature/SignatureModalHeader';
import { SignatureFooter } from './signature/SignatureFooter';
import { SignatureTabs } from './signature/SignatureTabs';
import { SignatureTabContents } from './signature/SignatureTabContents';

interface SignaturePadProps {
  open: boolean;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
  initialName?: string;
}

export function SignaturePad({ open, onClose, onSave, initialName = '' }: SignaturePadProps) {
  const [activeTab, setActiveTab] = useState<'draw' | 'type' | 'upload' | 'saved'>('draw');
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [typedName, setTypedName] = useState(initialName);
  const [saveToAccount, setSaveToAccount] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    savedSignatures, 
    loadSavedSignatures, 
    selectedSignatureId,
    setSelectedSignatureId,
    saveSignatureToDatabase,
    setSignatureAsDefault,
    deleteSignature,
    isAuthenticated 
  } = useSignature();
  
  useEffect(() => {
    if (open) {
      checkAuth();
    }
  }, [open]);
  
  const checkAuth = async () => {
    console.log("Checking auth status");
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session && activeTab === 'saved') {
      console.log("User authenticated, loading saved signatures");
      loadSavedSignatures();
    }
  };
  
  useEffect(() => {
    if (open && activeTab === 'saved' && isAuthenticated) {
      console.log("Tab changed to saved signatures, loading them");
      loadSavedSignatures();
    }
  }, [open, activeTab, isAuthenticated]);
  
  const handleDrawingChange = (dataUrl: string | null) => {
    setSignatureDataUrl(dataUrl);
  };
  
  const handleSave = async () => {
    let finalSignatureDataUrl: string | null = null;
    
    if (activeTab === 'saved' && selectedSignatureId) {
      const selectedSignature = savedSignatures.find(sig => sig.id === selectedSignatureId);
      if (selectedSignature) {
        finalSignatureDataUrl = selectedSignature.signature_data;
      }
    } else if (activeTab === 'draw' || activeTab === 'type' || activeTab === 'upload') {
      finalSignatureDataUrl = signatureDataUrl;
    }
    
    if (!finalSignatureDataUrl) {
      toast({
        title: "Error",
        description: "Please create a signature first",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (isAuthenticated && saveToAccount && activeTab !== 'saved') {
        setIsLoading(true);
        console.log("Saving signature to database", { 
          signatureName: signatureName || typedName || '', 
          isDefault 
        });
        
        try {
          await saveSignatureToDatabase(
            finalSignatureDataUrl, 
            signatureName || typedName || '', 
            isDefault
          );
        } catch (error) {
          console.error("Error saving to database but continuing:", error);
          // Continue with onSave even if database save fails
        }
      }
      
      onSave(finalSignatureDataUrl);
      onClose();
    } catch (error) {
      console.error('Error handling signature:', error);
      toast({
        title: "Error",
        description: "Failed to save signature. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <SignatureModalHeader />
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <SignatureTabs isAuthenticated={isAuthenticated} />
          
          <SignatureTabContents 
            activeTab={activeTab}
            initialName={initialName}
            onDataUrlChange={handleDrawingChange}
            onNameChange={setTypedName}
            isAuthenticated={isAuthenticated}
            saveToAccount={saveToAccount}
            onSaveToAccountChange={setSaveToAccount}
            signatureName={signatureName}
            onSignatureNameChange={setSignatureName}
            isDefault={isDefault}
            onIsDefaultChange={setIsDefault}
            savedSignatures={savedSignatures}
            selectedSignatureId={selectedSignatureId}
            onSelectSignature={setSelectedSignatureId}
            onSetDefault={setSignatureAsDefault}
            onDelete={deleteSignature}
            isLoading={isLoading}
            signatureDataUrl={signatureDataUrl}
          />
        </Tabs>
        
        <SignatureFooter 
          onClose={onClose} 
          onSave={handleSave} 
          isLoading={isLoading} 
        />
      </DialogContent>
    </Dialog>
  );
}
