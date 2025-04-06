
import React from 'react';
import { SavedDocument } from '@/types/document';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Share2, Download, Trash, Loader2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DocumentCardProps {
  document: SavedDocument;
  onEdit: (id: string) => void;
  onShare: (document: SavedDocument) => void;
  onDownload: (document: SavedDocument) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onEdit,
  onShare,
  onDownload,
  onDelete,
  isDeleting
}) => {
  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="truncate">{document.title}</CardTitle>
        <CardDescription className="flex items-center text-xs">
          <Clock className="h-3 w-3 mr-1 inline" />
          Updated {formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="h-24 overflow-hidden text-sm text-muted-foreground">
          <div dangerouslySetInnerHTML={{ 
            __html: document.content.length > 200 
              ? document.content.substring(0, 200) + '...' 
              : document.content 
          }} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/20 pt-3">
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => onEdit(document.id)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => onShare(document)}
          >
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => onDownload(document)}
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-destructive hover:text-destructive/90" 
          onClick={() => onDelete(document.id)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash className="h-4 w-4" />
          )}
          <span className="sr-only">Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
