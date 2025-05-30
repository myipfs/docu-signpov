import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DocumentUploader from '@/components/DocumentUploader';
import { SignaturePad } from '@/components/SignaturePad';
import { Button } from '@/components/ui/button';
import { toast } from '@/utils/toast';
import { Download, FileText, Eye } from 'lucide-react';

const QuickSign = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [documentName, setDocumentName] = useState<string>('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  
  const handleUploadComplete = (file: File) => {
    setDocumentUploaded(true);
    setDocumentName(file.name);
    setDocumentFile(file);
    
    // Generate document preview
    if (file.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(file);
      setDocumentPreview(fileUrl);
    } else if (file.type.startsWith('image/')) {
      const fileUrl = URL.createObjectURL(file);
      setDocumentPreview(fileUrl);
    } else {
      // For other file types, create a text preview
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          setDocumentPreview('data:text/html;charset=utf-8,' + encodeURIComponent(`
            <html>
              <body style="font-family: system-ui; padding: 20px;">
                <h2>${file.name}</h2>
                <p>Document ready for signing</p>
                <p style="color: #666;">This is a preview of your document.</p>
              </body>
            </html>
          `));
        } catch (err) {
          console.error('Error creating preview:', err);
        }
      };
      reader.readAsText(file);
    }
  };
  
  const handleSignatureCreate = (signatureDataUrl: string) => {
    setSignature(signatureDataUrl);
    setIsSignatureModalOpen(false);
    toast.success('Signature added to document');
  };
  
  const handleDownloadSigned = () => {
    if (!documentFile || !signature) {
      toast.error('No document or signature available');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create a combined document with signature for demo purposes
      // In production, you would merge the signature with the document properly
      if (documentFile.type === 'text/plain' || documentFile.name.endsWith('.txt')) {
        // For text files, append signature information
        const reader = new FileReader();
        reader.onload = (e) => {
          const originalContent = e.target?.result as string || '';
          const signedContent = `${originalContent}\n\n--- DIGITALLY SIGNED ---\n[Signature Applied]\nSigned on: ${new Date().toLocaleDateString()}\n`;
          
          const blob = new Blob([signedContent], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = url;
          a.download = `signed_${documentName}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          setIsLoading(false);
          toast.success('Signed document downloaded successfully!');
        };
        reader.readAsText(documentFile);
      } else {
        // For other file types, create an HTML version with the signature
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Signed Document: ${documentName}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .document-header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
              .signature-section { border-top: 1px solid #ccc; margin-top: 40px; padding-top: 20px; }
              .signature-image { max-width: 200px; height: auto; border: 1px solid #ddd; padding: 10px; }
            </style>
          </head>
          <body>
            <div class="document-header">
              <h1>Signed Document</h1>
              <p><strong>Original File:</strong> ${documentName}</p>
              <p><strong>Signed on:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>
            
            <div class="document-content">
              <p>This document has been digitally signed. The original file "${documentName}" has been processed and includes the signature below.</p>
              <p><em>Note: In a production environment, this would show the actual document content with the signature embedded.</em></p>
            </div>
            
            <div class="signature-section">
              <h3>Digital Signature</h3>
              <img src="${signature}" alt="Digital Signature" class="signature-image" />
              <p><strong>Status:</strong> Signed</p>
              <p><strong>Signature Type:</strong> Electronic Signature</p>
            </div>
          </body>
          </html>
        `;
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `signed_${documentName.replace(/\.[^/.]+$/, '')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setIsLoading(false);
        toast.success('Signed document downloaded successfully!');
      }
    } catch (error) {
      console.error('Download error:', error);
      setIsLoading(false);
      toast.error('Failed to download signed document');
    }
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
                
                <div className="bg-gray-100 rounded-lg min-h-[60vh] flex flex-col items-center justify-center mb-6">
                  {documentPreview ? (
                    documentPreview.startsWith('data:image') || documentPreview.startsWith('blob:') ? (
                      <img
                        src={documentPreview}
                        alt="Document preview"
                        className="max-w-full max-h-[60vh] object-contain"
                      />
                    ) : documentPreview.startsWith('data:text/html') ? (
                      <iframe 
                        src={documentPreview}
                        title="Document preview"
                        className="w-full h-[60vh] border-none"
                      />
                    ) : documentPreview.startsWith('data:application/pdf') || (documentFile?.type === 'application/pdf') ? (
                      <iframe 
                        src={documentPreview + '#toolbar=0'}
                        title="PDF preview"
                        className="w-full h-[60vh] border-none"
                      />
                    ) : (
                      <div className="text-center p-8 max-w-md">
                        <Eye className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-muted-foreground">Document preview available</p>
                        <p className="text-xs text-muted-foreground mt-2">Your document is ready for signing</p>
                      </div>
                    )
                  ) : (
                    <div className="text-center p-8 max-w-md">
                      <p className="text-muted-foreground mb-2">Document preview placeholder</p>
                      <p className="text-xs text-muted-foreground">In a production environment, this would show your actual document</p>
                    </div>
                  )}
                </div>
                
                <div className="border-2 border-dashed border-primary/40 rounded-lg p-6 relative min-h-[100px] flex items-center justify-center">
                  {signature ? (
                    <div className="text-center">
                      <img 
                        src={signature} 
                        alt="Your signature" 
                        className="max-h-20 mx-auto mb-2"
                      />
                      <p className="text-sm text-green-600 font-medium">✓ Signature Applied</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-primary/60 font-medium mb-2">Add your signature here</p>
                      <Button 
                        variant="outline" 
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
                    setDocumentPreview(null);
                    setDocumentFile(null);
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
