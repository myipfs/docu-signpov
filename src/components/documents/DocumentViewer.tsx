
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/utils/toast';

interface DocumentViewerProps {
  document: { title: string, content: string };
  onDownload: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onDownload }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{document.title}</h1>
        <Button variant="outline" size="sm" onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
      
      <Card className="p-6">
        <div 
          className="prose max-w-none dark:prose-invert" 
          dangerouslySetInnerHTML={{ __html: document.content }}
        />
      </Card>
    </>
  );
};
