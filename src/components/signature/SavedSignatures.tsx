
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Eraser } from 'lucide-react';
import type { SavedSignature } from '@/types/signatures';

interface SavedSignaturesProps {
  signatures: SavedSignature[];
  selectedSignatureId: string | null;
  onSelectSignature: (id: string) => void;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function SavedSignatures({ 
  signatures, 
  selectedSignatureId, 
  onSelectSignature, 
  onSetDefault, 
  onDelete,
  isLoading 
}: SavedSignaturesProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (signatures.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>You don't have any saved signatures yet.</p>
        <p className="text-sm mt-1">Create and save a signature using the other tabs.</p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-3">
      {signatures.map((signature) => (
        <div 
          key={signature.id} 
          className={`border rounded-md p-3 cursor-pointer transition-all ${
            selectedSignatureId === signature.id ? 'border-primary ring-1 ring-primary' : ''
          }`}
          onClick={() => onSelectSignature(signature.id)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {signature.name || 'Unnamed Signature'}
              </span>
              {signature.is_default && (
                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                  Default
                </span>
              )}
            </div>
            <div className="flex gap-1">
              {!signature.is_default && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetDefault(signature.id);
                  }}
                  title="Set as default"
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-destructive hover:text-destructive/90"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(signature.id);
                }}
                title="Delete signature"
              >
                <Eraser className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <div className="bg-white p-3 rounded border">
            <img 
              src={signature.signature_data} 
              alt={signature.name || 'Signature'} 
              className="max-h-12 mx-auto"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
