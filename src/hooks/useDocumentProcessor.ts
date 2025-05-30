
import { useState } from 'react';
import { toast } from '@/utils/toast';

export function useDocumentProcessor() {
  const [isLoading, setIsLoading] = useState(false);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
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

  const handleCancel = () => {
    setDocumentUploaded(false);
    setSignature(null);
    setDocumentPreview(null);
    setDocumentFile(null);
  };

  return {
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
  };
}
