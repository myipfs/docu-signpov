import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface BankStatementUploaderProps {
  onFileUpload: (file: File) => void;
  isConverting: boolean;
  error?: string;
  onErrorClear?: () => void;
}

export function BankStatementUploader({ 
  onFileUpload, 
  isConverting, 
  error, 
  onErrorClear 
}: BankStatementUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!file.type.includes('pdf')) {
      return 'Please select a PDF file. Other file formats are not supported.';
    }
    
    if (file.size > maxSize) {
      return 'File size must be less than 10MB. Please compress your PDF or try a different file.';
    }
    
    if (file.size === 0) {
      return 'The selected file appears to be empty. Please choose a valid bank statement PDF.';
    }
    
    return null;
  };

  const handleButtonClick = () => {
    if (!isConverting) {
      fileInputRef.current?.click();
      if (error && onErrorClear) {
        onErrorClear();
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        alert(validationError);
        return;
      }
      onFileUpload(file);
    }
    // Clear the input so the same file can be uploaded again
    event.target.value = '';
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!isConverting) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    if (isConverting) return;
    
    const file = event.dataTransfer.files[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        alert(validationError);
        return;
      }
      if (error && onErrorClear) {
        onErrorClear();
      }
      onFileUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                Upload Error
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragging 
            ? 'border-primary bg-primary/5 scale-[1.02]' 
            : error 
              ? 'border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-950/10'
              : 'border-border hover:border-primary/50 hover:bg-muted/25'
        } ${isConverting ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <div className="flex flex-col items-center space-y-6">
          {isConverting ? (
            <div className="space-y-4">
              <Loader2 size={48} className="text-primary animate-spin" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Processing Your Bank Statement</h3>
                <p className="text-sm text-foreground/70 max-w-md">
                  Extracting transaction data from your PDF. This process may take a few moments depending on the file size and complexity.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload size={48} className={isDragging ? 'text-primary' : 'text-foreground/40'} />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  {isDragging ? 'Drop Your PDF Here' : 'Upload Bank Statement'}
                </h3>
                <p className="text-sm text-foreground/70 max-w-md">
                  {isDragging 
                    ? 'Release to upload your bank statement PDF'
                    : 'Drag and drop your PDF bank statement here, or click to browse files'
                  }
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-xs text-foreground/50 bg-muted/30 rounded-full px-3 py-1">
                <FileText size={14} />
                PDF format • Max 10MB • Secure processing
              </div>
              
              <Button 
                type="button"
                onClick={handleButtonClick}
                className="flex items-center gap-2"
                disabled={isConverting}
                size="lg"
              >
                <Upload size={16} />
                Select PDF File
              </Button>
            </div>
          )}
        </div>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
        disabled={isConverting}
      />

      {/* Feature List */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-foreground/70">
            <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
            <span>Supports all major banks worldwide</span>
          </div>
          <div className="flex items-center gap-2 text-foreground/70">
            <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
            <span>Automatic transaction categorization</span>
          </div>
          <div className="flex items-center gap-2 text-foreground/70">
            <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
            <span>Secure processing - no data storage</span>
          </div>
          <div className="flex items-center gap-2 text-foreground/70">
            <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
            <span>Real-time balance calculations</span>
          </div>
        </div>
      </div>
    </div>
  );
}
