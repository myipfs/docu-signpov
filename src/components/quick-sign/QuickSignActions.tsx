// File: QuickSignActions.tsx (REPLACE your existing file)
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface SignaturePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  pageIndex: number;
}

interface QuickSignActionsProps {
  signature: string | null;
  isLoading: boolean;
  originalFile: File | null;  // ADD THIS
  signaturePosition: SignaturePosition | null;  // ADD THIS
  onCancel: () => void;
  onDownload: (file: File, signature: string, position: SignaturePosition) => Promise<void>;  // CHANGE THIS
}

export function QuickSignActions({ 
  signature, 
  isLoading, 
  originalFile,      // ADD THIS
  signaturePosition, // ADD THIS
  onCancel, 
  onDownload 
}: QuickSignActionsProps) {
  
  const handleDownload = async () => {
    if (!originalFile || !signature || !signaturePosition) {
      console.error('Missing required data for download');
      return;
    }
    
    await onDownload(originalFile, signature, signaturePosition);
  };

  const canDownload = signature && originalFile && signaturePosition && !isLoading;

  return (
    <div className="flex justify-end gap-4">
      <Button 
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        onClick={handleDownload}
        disabled={!canDownload}
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
  );
}
