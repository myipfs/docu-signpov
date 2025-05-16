
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SignatureFooterProps {
  onClose: () => void;
  onSave: () => void;
  isLoading: boolean;
}

export function SignatureFooter({ onClose, onSave, isLoading }: SignatureFooterProps) {
  return (
    <DialogFooter>
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button onClick={onSave} disabled={isLoading}>
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
  );
}
