import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface BankStatementUploaderProps {
  onFileUpload: (file: File) => void;
  isConverting: boolean;
}

export function BankStatementUploader({ onFileUpload, isConverting }: BankStatementUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.includes('pdf')) {
      onFileUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <div className="flex flex-col items-center space-y-4">
          {isConverting ? (
            <Loader2 size={48} className="text-primary animate-spin" />
          ) : (
            <Upload size={48} className="text-foreground/40" />
          )}
          
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {isConverting ? 'Converting...' : 'Upload Bank Statement'}
            </h3>
            <p className="text-sm text-foreground/70 mb-4">
              {isConverting 
                ? 'Please wait while we process your bank statement'
                : 'Drag and drop your PDF bank statement here, or click to browse'
              }
            </p>
            {!isConverting && (
              <div className="flex items-center justify-center gap-2 text-xs text-foreground/50">
                <FileText size={16} />
                Supports PDF files from any bank
              </div>
            )}
          </div>

          {!isConverting && (
            <Button 
              type="button"
              onClick={handleButtonClick}
              className="flex items-center gap-2"
            >
              <Upload size={16} />
              Select PDF File
            </Button>
          )}
        </div>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="text-xs text-foreground/50 space-y-1">
        <p>• Supports bank statements from any bank worldwide</p>
        <p>• Maximum file size: 10MB</p>
        <p>• Only PDF format is supported</p>
        <p>• Your data is processed securely and not stored</p>
      </div>
    </div>
  );
}