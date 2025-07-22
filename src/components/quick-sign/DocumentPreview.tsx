
import React from 'react';
import { FileText, Eye } from 'lucide-react';

interface DocumentPreviewProps {
  documentName: string;
  documentPreview: string | null;
  documentFile: File | null;
}

export function DocumentPreview({ documentName, documentPreview, documentFile }: DocumentPreviewProps) {
  return (
    <>
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-1">{documentName}</h2>
            <p className="text-muted-foreground text-sm">Ready for signing</p>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Document Preview</h3>
        </div>
        
        <div className="bg-gray-100 rounded-lg min-h-[60vh] flex flex-col items-center justify-center mb-6">
          {documentPreview ? (
            documentPreview.startsWith('data:image') || documentPreview.startsWith('blob:') ? (
              <img
                src={documentPreview}
                alt="Document preview"
                className="max-w-full max-h-[60vh] object-contain"
              />
            ) : documentPreview.startsWith('data:text/html') ? (
              <iframe 
                src={documentPreview}
                title="Document preview"
                className="w-full h-[60vh] border-none"
              />
            ) : documentFile?.type === 'application/pdf' ? (
              <iframe 
                src={documentPreview}
                title="PDF preview"
                className="w-full h-[60vh] border-none"
                style={{ border: 'none' }}
              />
            ) : (
              <div className="text-center p-8 max-w-md">
                <Eye className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">Document preview available</p>
                <p className="text-xs text-muted-foreground mt-2">Your document is ready for signing</p>
              </div>
            )
          ) : (
            <div className="text-center p-8 max-w-md">
              <p className="text-muted-foreground mb-2">Document preview placeholder</p>
              <p className="text-xs text-muted-foreground">In a production environment, this would show your actual document</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
