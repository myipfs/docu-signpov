
import React from 'react';
import { Check } from 'lucide-react';

interface SignatureDisplayProps {
  signature: string | null;
  recipientName: string;
  isSigned: boolean;
}

export function SignatureDisplay({ signature, recipientName, isSigned }: SignatureDisplayProps) {
  if (!isSigned) {
    return null;
  }

  return (
    <div className="py-2 px-4 bg-white rounded border">
      {signature ? (
        <img src={signature} alt="Signature" className="max-h-16" />
      ) : (
        <div className="font-signature text-lg">{recipientName}</div>
      )}
      <div className="flex items-center text-xs text-green-600 mt-1">
        <Check className="h-3 w-3 mr-1" />
        Signed
      </div>
    </div>
  );
}
