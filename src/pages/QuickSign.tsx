
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DocumentUploader from '@/components/DocumentUploader';
import { SignaturePad } from '@/components/SignaturePad';
import { Button } from '@/components/ui/button';
import { toast } from '@/utils/toast';
import { Download, FileText } from 'lucide-react';

const QuickSign = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [documentName, setDocumentName] = useState<string>('');
  
  const handleUploadComplete = (file: File) => {
    setDocumentUploaded(true);
    setDocumentName(file.name);
  };
  
  const handleSignatureCreate = (signatureDataUrl: string) => {
    setSignature(signatureDataUrl);
    setIsSignatureModalOpen(false);
    toast.success('Signature added to document');
  };
  
  const handleDownloadSigned = () => {
    setIsLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Signed document downloaded successfully!');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Quick Document Signing</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload, sign, and download your document in minutes. No account required.
            </p>
          </div>
          
          {!documentUploaded ? (
            <div className="max-w-2xl mx-auto">
              <DocumentUploader onUploadComplete={handleUploadComplete} />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-1">{documentName}</h2>
                    <p className="text-muted-foreground text-sm">Ready for signing</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-6 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Document Preview</h3>
                </div>
                
                <div className="bg-gray-100 rounded-lg min-h-[60vh] flex items-center justify-center mb-6">
                  <div className="text-center p-8 max-w-md">
                    <p className="text-muted-foreground mb-2">Document preview placeholder</p>
                    <p className="text-xs text-muted-foreground">In a production environment, this would show your actual document</p>
                  </div>
                </div>
                
                <div className="border-2 border-dashed border-primary/40 rounded-lg p-6 relative">
                  {signature ? (
                    <img 
                      src={signature} 
                      alt="Your signature" 
                      className="max-h-16 mx-auto"
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-primary/60 font-medium">Add your signature here</p>
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => setIsSignatureModalOpen(true)}
                      >
                        Click to sign
                      </Button>
                    </div>
                  )}
                  <div className="absolute -top-3 left-4 bg-white px-2 text-xs text-foreground/50">
                    Your Signature
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setDocumentUploaded(false);
                    setSignature(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDownloadSigned}
                  disabled={!signature || isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download Signed Document
                    </>
                  )}
                </Button>
              </div>
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
        onSave={handleSignatureCreate}
        initialName=""
      />
      
      <Footer />
    </div>
  );
};

export default QuickSign;
