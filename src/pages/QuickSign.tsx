
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DocumentUploader from '@/components/DocumentUploader';
import { SignaturePad } from '@/components/SignaturePad';
import { QuickSignHeader } from '@/components/quick-sign/QuickSignHeader';
import { DocumentPreview } from '@/components/quick-sign/DocumentPreview';
import { SignatureArea } from '@/components/quick-sign/SignatureArea';
import { QuickSignActions } from '@/components/quick-sign/QuickSignActions';
import { useDocumentProcessor } from '@/hooks/useDocumentProcessor';

const QuickSign = () => {
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  
  const {
    isLoading,
    documentUploaded,
    signature,
    documentName,
    documentFile,
    documentPreview,
    handleUploadComplete,
    handleSignatureCreate,
    handleDownloadSigned,
    handleCancel
  } = useDocumentProcessor();
  
  const handleSignClick = () => {
    setIsSignatureModalOpen(true);
  };

  const handleSignatureSave = (signatureDataUrl: string) => {
    setIsSignatureModalOpen(false);
    handleSignatureCreate(signatureDataUrl);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <QuickSignHeader />
          
          {!documentUploaded ? (
            <div className="max-w-2xl mx-auto">
              <DocumentUploader onUploadComplete={handleUploadComplete} />
            </div>
          ) : (
            <div className="space-y-8">
              <DocumentPreview 
                documentName={documentName}
                documentPreview={documentPreview}
                documentFile={documentFile}
              />
              
              <SignatureArea 
                signature={signature}
                onSignClick={handleSignClick}
              />
              
              <QuickSignActions 
                signature={signature}
                isLoading={isLoading}
                onCancel={handleCancel}
                onDownload={handleDownloadSigned}
              />
            </div>
          )}
          
          <div className="mt-10 text-center text-sm text-muted-foreground">
            <p>Want to save your signature for future use?</p>
            <p className="mt-1">
              <a href="/dashboard" className="text-primary hover:underline">Create an account</a> 
              {" "}to store signatures and manage documents.
            </p>
          </div>
        </div>
      </main>
      
      <SignaturePad 
        open={isSignatureModalOpen} 
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={handleSignatureSave}
        initialName=""
      />
      
      <Footer />
    </div>
  );
};

export default QuickSign;
