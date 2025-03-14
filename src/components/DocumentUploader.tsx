import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/utils/toast';

export default function DocumentUploader({ onUploadComplete }: { onUploadComplete?: (file: File) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const droppedFile = files[0];
      handleFileSelect(droppedFile);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      handleFileSelect(selectedFile);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    const acceptedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];

    if (!acceptedTypes.includes(selectedFile.type)) {
      toast.error('Please upload a PDF, Word document, JPG, or PNG file');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setUploading(false);
    
    if (onUploadComplete) {
      onUploadComplete(file);
    }
    
    toast.success('Document uploaded successfully!');
    setFile(null);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/50",
          file ? "bg-secondary/30" : ""
        )}
      >
        {!file ? (
          <div className="flex flex-col items-center justify-center py-6">
            <svg 
              className="w-12 h-12 text-primary/40 mb-4" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
              <path d="M12 12v9"></path>
              <path d="m16 16-4-4-4 4"></path>
            </svg>
            <p className="text-lg font-medium mb-2">Drag and drop your document here</p>
            <p className="text-sm text-foreground/60 mb-4">or</p>
            <label className="relative">
              <Button variant="outline" size="sm" className="rounded-lg cursor-pointer">
                Browse files
              </Button>
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleFileInputChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </label>
            <p className="text-xs text-foreground/60 mt-4">
              Supports PDF, Word, JPG, PNG (Max 10MB)
            </p>
          </div>
        ) : (
          <div className="py-6">
            <div className="flex items-center justify-center mb-4">
              <svg 
                className="w-10 h-10 text-primary/60 mr-3" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <p className="text-lg font-medium mb-1">{file.name}</p>
            <p className="text-sm text-foreground/60 mb-6">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <div className="flex justify-center space-x-3">
              <Button 
                onClick={handleUpload} 
                disabled={uploading}
                className="relative rounded-lg"
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
                {uploading && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleRemoveFile}
                disabled={uploading}
                className="rounded-lg"
              >
                Remove
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
