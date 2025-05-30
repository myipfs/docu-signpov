
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface QuickSignActionsProps {
  signature: string | null;
  isLoading: boolean;
  onCancel: () => void;
  onDownload: () => void;
}

export function QuickSignActions({ signature, isLoading, onCancel, onDownload }: QuickSignActionsProps) {
  return (
    <div className="flex justify-end gap-4">
      <Button 
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        onClick={onDownload}
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
  );
}
