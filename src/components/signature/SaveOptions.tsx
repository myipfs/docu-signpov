
import React from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface SaveOptionsProps {
  isAuthenticated: boolean;
  saveToAccount: boolean;
  onSaveToAccountChange: (checked: boolean) => void;
  signatureName: string;
  onSignatureNameChange: (name: string) => void;
  isDefault: boolean;
  onIsDefaultChange: (checked: boolean) => void;
}

export function SaveOptions({
  isAuthenticated,
  saveToAccount,
  onSaveToAccountChange,
  signatureName,
  onSignatureNameChange,
  isDefault,
  onIsDefaultChange
}: SaveOptionsProps) {
  if (!isAuthenticated) {
    return (
      <div className="mt-4 pt-2 border-t text-xs text-muted-foreground">
        <p>Want to save this signature for future use?</p>
        <p className="mt-1">
          <a href="/dashboard" className="text-primary hover:underline">Create an account</a> 
          {" "}to store signatures and access them anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="save-signature" 
          checked={saveToAccount}
          onCheckedChange={(checked) => onSaveToAccountChange(checked as boolean)}
        />
        <label htmlFor="save-signature" className="text-sm cursor-pointer">
          Save this signature to my account
        </label>
      </div>
      
      {saveToAccount && (
        <div className="space-y-2">
          <Input
            placeholder="Signature name (optional)"
            value={signatureName}
            onChange={(e) => onSignatureNameChange(e.target.value)}
            className="text-sm"
          />
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="default-signature" 
              checked={isDefault}
              onCheckedChange={(checked) => onIsDefaultChange(checked as boolean)}
            />
            <label htmlFor="default-signature" className="text-sm cursor-pointer">
              Set as default signature
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
