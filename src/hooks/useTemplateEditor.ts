
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/utils/toast';
import { Template } from '@/types/template';
import { useSession } from '@/context/SessionContext';
import { generateTemplateContent } from '@/utils/templates';
import { supabase } from '@/integrations/supabase/client';

export interface SavedDocument {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const useTemplateEditor = (templateId: string | undefined, templates: Template[]) => {
  const navigate = useNavigate();
  const { session } = useSession();
  const isAuthenticated = !!session?.user;
  
  const [template, setTemplate] = useState<Template | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [activeTab, setActiveTab] = useState('edit');
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    if (templateId) {
      const foundTemplate = templates.find(t => t.id === templateId);
      if (foundTemplate) {
        setTemplate(foundTemplate);
        setDocumentTitle(foundTemplate.title);
        
        // Generate template content based on the template category
        const generatedContent = generateTemplateContent(foundTemplate);
        setContent(generatedContent);
        setOriginalContent(generatedContent);
      } else {
        toast({
          title: "Template not found",
          description: "The requested template could not be found.",
          variant: "destructive"
        });
        navigate('/templates');
      }
    }
  }, [templateId, navigate, templates]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in or create an account to save documents.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Check if we have a document ID (for update) or need to create a new document
      if (documentId) {
        // Update existing document
        const { error } = await supabase
          .from('documents')
          .update({
            title: documentTitle,
            content: content,
            updated_at: new Date().toISOString()
          })
          .eq('id', documentId);
          
        if (error) throw error;
        
        toast({
          title: "Document updated",
          description: "Your document has been updated successfully.",
        });
      } else {
        // Create new document
        const { data, error } = await supabase
          .from('documents')
          .insert({
            title: documentTitle,
            content: content,
            user_id: session?.user.id,
            template_id: templateId || null
          })
          .select('id')
          .single();
          
        if (error) throw error;
        
        setDocumentId(data.id);
        
        toast({
          title: "Document saved",
          description: "Your document has been saved successfully.",
        });
      }
    } catch (error: any) {
      console.error('Error saving document:', error);
      toast({
        title: "Save failed",
        description: error.message || "Could not save your document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    // Create a blob with the content
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and click it
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Document downloaded",
      description: "Your document has been downloaded successfully.",
    });
  };

  const handleShare = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in or create an account to share documents.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSharing(true);
      
      // First save the document if it hasn't been saved yet
      if (!documentId) {
        await handleSave();
      }
      
      if (!documentId) {
        throw new Error("Failed to save document before sharing");
      }
      
      // Update the document to set is_public to true
      const { error } = await supabase
        .from('documents')
        .update({ is_public: true })
        .eq('id', documentId);
        
      if (error) throw error;
      
      // Generate a share URL
      const baseUrl = window.location.origin;
      const newShareUrl = `${baseUrl}/view-document/${documentId}`;
      setShareUrl(newShareUrl);
      
      // Copy to clipboard
      navigator.clipboard.writeText(newShareUrl).then(
        () => {
          toast({
            title: "Share link created",
            description: "A sharing link has been copied to your clipboard.",
          });
        },
        (err) => {
          console.error('Could not copy text: ', err);
          toast({
            title: "Share link created",
            description: `Share this link: ${newShareUrl}`,
          });
        }
      );
    } catch (error: any) {
      console.error('Error sharing document:', error);
      toast({
        title: "Share failed",
        description: error.message || "Could not share your document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleLoginRedirect = () => {
    // Save current state to localStorage or URL params if needed
    navigate('/auth', { state: { returnTo: window.location.pathname } });
  };

  return {
    template,
    documentTitle,
    setDocumentTitle,
    content,
    setContent,
    originalContent,
    activeTab,
    setActiveTab,
    isAuthenticated,
    handleSave,
    handleDownload,
    handleShare,
    handleLoginRedirect,
    isSaving,
    isSharing,
    documentId,
    shareUrl
  };
};
