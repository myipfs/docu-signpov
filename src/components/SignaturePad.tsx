import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { SignatureCanvas } from './signature/SignatureCanvas';
import { TypedSignature } from './signature/TypedSignature';
import { UploadedSignature } from './signature/UploadedSignature';
import { SavedSignatures } from './signature/SavedSignatures';
import { SaveOptions } from './signature/SaveOptions';
import { useSignature } from '@/hooks/useSignature';
import { supabase } from '@/integrations/supabase/client';

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
        <DialogHeader>
          <DialogTitle>Create Your Signature</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className={`grid ${isAuthenticated ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <TabsTrigger value="draw">Draw</TabsTrigger>
            <TabsTrigger value="type">Type</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            {isAuthenticated && (
              <TabsTrigger value="saved">Saved</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="draw" className="mt-4">
            <SignatureCanvas onDataUrlChange={handleDrawingChange} />
            
            <SaveOptions 
              isAuthenticated={isAuthenticated}
              saveToAccount={saveToAccount}
              onSaveToAccountChange={setSaveToAccount}
              signatureName={signatureName}
              onSignatureNameChange={setSignatureName}
              isDefault={isDefault}
              onIsDefaultChange={setIsDefault}
            />
          </TabsContent>
          
          <TabsContent value="type" className="mt-4">
            <TypedSignature 
              initialName={initialName}
              onDataUrlChange={handleDrawingChange}
              onNameChange={setTypedName}
            />
            
            <SaveOptions 
              isAuthenticated={isAuthenticated}
              saveToAccount={saveToAccount}
              onSaveToAccountChange={setSaveToAccount}
              signatureName={signatureName}
              onSignatureNameChange={setSignatureName}
              isDefault={isDefault}
              onIsDefaultChange={setIsDefault}
            />
          </TabsContent>
          
          <TabsContent value="upload" className="mt-4">
            <UploadedSignature onDataUrlChange={handleDrawingChange} />
            
            {isAuthenticated && signatureDataUrl && (
              <SaveOptions 
                isAuthenticated={isAuthenticated}
                saveToAccount={saveToAccount}
                onSaveToAccountChange={setSaveToAccount}
                signatureName={signatureName}
                onSignatureNameChange={setSignatureName}
                isDefault={isDefault}
                onIsDefaultChange={setIsDefault}
              />
            )}
          </TabsContent>
          
          {isAuthenticated && (
            <TabsContent value="saved" className="mt-4">
              <SavedSignatures 
                signatures={savedSignatures}
                selectedSignatureId={selectedSignatureId}
                onSelectSignature={setSelectedSignatureId}
                onSetDefault={setSignatureAsDefault}
                onDelete={deleteSignature}
                isLoading={isLoading}
              />
            </TabsContent>
          )}
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                Processing...
              </>
            ) : (
              'Save Signature'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
