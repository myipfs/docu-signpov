// File: src/hooks/useDocumentSigning.ts
import { useState, useCallback } from 'react';
import { PDFSignatureProcessor } from './PDFSignatureProcessor';

interface SignaturePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  pageIndex: number;
}

interface UseDocumentSigningReturn {
  isProcessing: boolean;
  error: string | null;
  processDocument: (file: File, signature: string, position: SignaturePosition) => Promise<Blob | null>;
  processTextSignature: (file: File, text: string, position: SignaturePosition) => Promise<Blob | null>;
}

export function useDocumentSigning(): UseDocumentSigningReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processDocument = useCallback(async (
    file: File, 
    signature: string, 
    position: SignaturePosition
  ): Promise<Blob | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      const processor = new PDFSignatureProcessor();
      await processor.loadPDF(file);
      
      const signedPdfBytes = await processor.addSignature(signature, position);
      
      return new Blob([signedPdfBytes], { type: 'application/pdf' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error processing document:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const processTextSignature = useCallback(async (
    file: File,
    text: string,
    position: SignaturePosition
  ): Promise<Blob | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      const processor = new PDFSignatureProcessor();
      await processor.loadPDF(file);
      
      const signedPdfBytes = await processor.addTextSignature(text, position);
      
      return new Blob([signedPdfBytes], { type: 'application/pdf' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error processing document:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    isProcessing,
    error,
    processDocument,
    processTextSignature
  };
}
