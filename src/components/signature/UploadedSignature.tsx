
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/utils/toast';
import { Upload } from 'lucide-react';

interface UploadedSignatureProps {
  onDataUrlChange: (dataUrl: string | null) => void;
}

export function UploadedSignature({ onDataUrlChange }: UploadedSignatureProps) {
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setUploadedSignature(event.target.result);
        onDataUrlChange(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleRemove = () => {
    setUploadedSignature(null);
    onDataUrlChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border border-dashed rounded-md p-8 text-center">
      {uploadedSignature ? (
        <div className="flex flex-col items-center">
          <img 
            src={uploadedSignature} 
            alt="Uploaded signature" 
            className="max-h-32 mb-4" 
          />
          <Button 
            variant="outline" 
            onClick={handleRemove}
          >
            Remove
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            Upload an image of your signature
          </p>
          <Button variant="outline" type="button" onClick={handleButtonClick}>
            Choose File
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            onClick={(e) => {
              // Reset the value to allow reselecting the same file
              (e.target as HTMLInputElement).value = '';
            }}
          />
        </div>
      )}
    </div>
  );
}
