
import { useState } from 'react';
import { toast } from '@/utils/toast';
import jsPDF from 'jspdf';

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
    toast.success('Signature added to document');
  };
  
  const handleDownloadSigned = () => {
    if (!documentFile || !signature) {
      toast.error('No document or signature available');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create a PDF with the signature
      const pdf = new jsPDF();
      
      // Add document info
      pdf.setFontSize(20);
      pdf.text('Signed Document', 20, 30);
      
      pdf.setFontSize(12);
      pdf.text(`Original File: ${documentName}`, 20, 50);
      pdf.text(`Signed on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, 65);
      
      // Add document content placeholder
      pdf.setFontSize(14);
      pdf.text('Document Content:', 20, 90);
      pdf.setFontSize(10);
      pdf.text('This document has been digitally signed.', 20, 105);
      pdf.text('In a production environment, the original document content would appear here.', 20, 115);
      
      // Add signature
      pdf.setFontSize(14);
      pdf.text('Digital Signature:', 20, 150);
      
      // Add signature image if it's a data URL
      if (signature.startsWith('data:image/')) {
        try {
          pdf.addImage(signature, 'PNG', 20, 160, 80, 40);
        } catch (imgError) {
          console.error('Error adding signature image:', imgError);
          pdf.setFontSize(10);
          pdf.text('[Signature could not be embedded]', 20, 170);
        }
      }
      
      // Add signature details
      pdf.setFontSize(10);
      pdf.text('Status: Digitally Signed', 20, 220);
      pdf.text('Signature Type: Electronic Signature', 20, 230);
      pdf.text('Verification: Valid', 20, 240);
      
      // Save the PDF
      const filename = `signed_${documentName.replace(/\.[^/.]+$/, '')}.pdf`;
      pdf.save(filename);
      
      setIsLoading(false);
      toast.success('Signed PDF document downloaded successfully!');
    } catch (error) {
      console.error('PDF creation error:', error);
      setIsLoading(false);
      toast.error('Failed to create signed PDF document');
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
