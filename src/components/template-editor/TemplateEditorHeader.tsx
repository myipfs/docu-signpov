
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, LogIn, Save, Share2 } from 'lucide-react';
import { toast } from '@/utils/toast';

interface TemplateEditorHeaderProps {
  documentTitle: string;
  setDocumentTitle: (title: string) => void;
  isAuthenticated: boolean;
  handleSave: () => void;
  handleShare: () => void;
  handleDownload: () => void;
  handleLoginRedirect: () => void;
}

const TemplateEditorHeader: React.FC<TemplateEditorHeaderProps> = ({
  documentTitle,
  setDocumentTitle,
  isAuthenticated,
  handleSave,
  handleShare,
  handleDownload,
  handleLoginRedirect,
}) => {
  const navigate = useNavigate();

  const handleBackToTemplates = () => {
    navigate('/templates');
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
        <div className="flex items-center gap-4">
          <Input
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="text-xl font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
            placeholder="Document Title"
          />
        </div>
        
        <div className="flex gap-2">
          {!isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={handleLoginRedirect}>
              <LogIn className="mr-2 h-4 w-4" />
              Login to Save
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
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
