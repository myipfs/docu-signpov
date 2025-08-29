import { useState } from 'react';
import { toast } from '@/utils/toast';
import { PDFDocument, rgb } from 'pdf-lib';

interface SignaturePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  pageIndex: number;
}

export function useDocumentProcessor() {
  const [isLoading, setIsLoading] = useState(false);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [signaturePosition, setSignaturePosition] = useState<SignaturePosition | null>(null);
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
      // For other file types, show file info
      setDocumentPreview(`data:text/html;charset=utf-8,${encodeURIComponent(`
        <div style="font-family: system-ui; padding: 20px; text-align: center;">
          <h2>${file.name}</h2>
          <p>File size: ${(file.size / 1024).toFixed(1)} KB</p>
          <p>Type: ${file.type || 'Unknown'}</p>
          <p style="color: #666; margin-top: 20px;">Document ready for signing</p>
        </div>
      `)}`);
    }
  };
  
  const handleSignatureCreate = (signatureDataUrl: string) => {
    setSignature(signatureDataUrl);
    // Set a default position for the signature (bottom right of first page)
    setSignaturePosition({
      x: 400, // X position from left
      y: 100, // Y position from bottom (PDF coordinates start from bottom)
      width: 150,
      height: 50,
      pageIndex: 0 // First page
    });
    toast.success('Signature added to document');
  };

  // Helper function to convert data URL to bytes
  const dataUrlToBytes = (dataUrl: string): Uint8Array => {
    const base64 = dataUrl.split(',')[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  };
  
  const handleDownloadSigned = async () => {
    if (!documentFile || !signature || !signaturePosition) {
      toast.error('No document or signature available');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (documentFile.type === 'application/pdf') {
        // Handle PDF files with pdf-lib
        const arrayBuffer = await documentFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        
        // Get the page where signature should be placed
        const pages = pdfDoc.getPages();
        const page = pages[signaturePosition.pageIndex] || pages[0];
        
        // Convert signature image to PDF-compatible format
        let signatureImage;
        if (signature.startsWith('data:image/png')) {
          const signatureBytes = dataUrlToBytes(signature);
          signatureImage = await pdfDoc.embedPng(signatureBytes);
        } else if (signature.startsWith('data:image/jpeg')) {
          const signatureBytes = dataUrlToBytes(signature);
          signatureImage = await pdfDoc.embedJpg(signatureBytes);
        } else {
          throw new Error('Unsupported signature format');
        }

        // Add signature to page
        page.drawImage(signatureImage, {
          x: signaturePosition.x,
          y: signaturePosition.y,
          width: signaturePosition.width,
          height: signaturePosition.height,
        });

        // Add timestamp and verification info
        page.drawText(`Digitally signed on ${new Date().toLocaleDateString()}`, {
          x: signaturePosition.x,
          y: signaturePosition.y - 10,
          size: 8,
          color: rgb(0.5, 0.5, 0.5),
        });
        
        // Save the modified PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        // Download the signed PDF
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `signed-${documentFile.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success('Signed PDF downloaded with embedded signature!');
        
      } else {
        // For non-PDF files, create a new PDF with the document content and signature
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
        
        // Add document info
        page.drawText('DIGITALLY SIGNED DOCUMENT', {
          x: 50,
          y: 750,
          size: 18,
          color: rgb(0, 0, 0),
        });
        
        page.drawText(`Original File: ${documentFile.name}`, {
          x: 50,
          y: 720,
          size: 12,
          color: rgb(0, 0, 0),
        });
        
        page.drawText(`File Type: ${documentFile.type}`, {
          x: 50,
          y: 700,
          size: 12,
          color: rgb(0, 0, 0),
        });
        
        page.drawText(`Signed: ${new Date().toLocaleString()}`, {
          x: 50,
          y: 680,
          size: 12,
          color: rgb(0, 0, 0),
        });

        // Add signature
        if (signature.startsWith('data:image/png') || signature.startsWith('data:image/jpeg')) {
          const signatureBytes = dataUrlToBytes(signature);
          const signatureImage = signature.startsWith('data:image/png') 
            ? await pdfDoc.embedPng(signatureBytes)
            : await pdfDoc.embedJpg(signatureBytes);
          
          page.drawImage(signatureImage, {
            x: 50,
            y: 150,
            width: 200,
            height: 75,
          });
        }
        
        // Add signature verification
        page.drawText('Electronic Signature Applied', {
          x: 50,
          y: 100,
          size: 10,
          color: rgb(0, 0.5, 0),
        });
        
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `signed-${documentFile.name.replace(/\.[^/.]+$/, '')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success('Signed document created and downloaded!');
      }
      
    } catch (error) {
      console.error('PDF processing error:', error);
      toast.error('Failed to process document with signature');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setDocumentUploaded(false);
    setSignature(null);
    setSignaturePosition(null);
    setDocumentPreview(null);
    setDocumentFile(null);
  };

  return {
    isLoading,
    documentUploaded,
    signature,
    signaturePosition,
    documentName,
    documentFile,
    documentPreview,
    handleUploadComplete,
    handleSignatureCreate,
    handleDownloadSigned,
    handleCancel,
    setSignaturePosition
  };
}
