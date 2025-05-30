
import React from 'react';
import { Button } from '@/components/ui/button';

interface SignatureAreaProps {
  signature: string | null;
  onSignClick: () => void;
}

export function SignatureArea({ signature, onSignClick }: SignatureAreaProps) {
  return (
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
            onClick={onSignClick}
          >
            Click to sign
          </Button>
        </div>
      )}
      <div className="absolute -top-3 left-4 bg-white px-2 text-xs text-foreground/50">
        Your Signature
      </div>
    </div>
  );
}
