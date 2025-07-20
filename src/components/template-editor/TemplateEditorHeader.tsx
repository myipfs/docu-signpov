
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, LogIn, Save, Share2, Loader2 } from 'lucide-react';
import { toast } from '@/utils/toast';

interface TemplateEditorHeaderProps {
  documentTitle: string;
  setDocumentTitle: (title: string) => void;
  isAuthenticated: boolean;
  handleSave: () => void;
  handleShare: () => void;
  handleDownload: () => void;
  handleLoginRedirect: () => void;
  isSaving?: boolean;
  isSharing?: boolean;
  documentId?: string | null;
  shareUrl?: string | null;
}

const TemplateEditorHeader: React.FC<TemplateEditorHeaderProps> = ({
  documentTitle,
  setDocumentTitle,
  isAuthenticated,
  handleSave,
  handleShare,
  handleDownload,
  handleLoginRedirect,
  isSaving = false,
  isSharing = false,
  documentId,
  shareUrl,
}) => {
  const navigate = useNavigate();

  const handleBackToTemplates = () => {
    navigate('/templates');
  };

  const handleCopyShareLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl).then(
        () => {
          toast({
            title: "Link copied",
            description: "Share link has been copied to clipboard.",
          });
        },
        (err) => {
          console.error('Could not copy text: ', err);
          toast({
            title: "Copy failed",
            description: "Could not copy link to clipboard.",
            variant: "destructive"
          });
        }
      );
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        onClick={handleBackToTemplates} 
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Templates
      </Button>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Input
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="text-xl font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto min-w-0 flex-1"
            placeholder="Document Title"
          />
          {documentId && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              Document saved
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          {!isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={handleLoginRedirect}>
              <LogIn className="mr-2 h-4 w-4" />
              Login to Save
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare} 
                disabled={isSharing || isSaving}
              >
                {isSharing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Share2 className="mr-2 h-4 w-4" />
                )}
                {shareUrl ? 'Copy Link' : 'Share'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </>
  );
};

export default TemplateEditorHeader;
