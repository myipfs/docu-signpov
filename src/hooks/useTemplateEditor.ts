
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/utils/toast';
import { Template } from '@/types/template';
import { useSession } from '@/context/SessionContext';
import { generateTemplateContent } from '@/utils/templateGenerators';

export const useTemplateEditor = (templateId: string | undefined, templates: Template[]) => {
  const navigate = useNavigate();
  const { session } = useSession();
  const isAuthenticated = !!session?.user;
  
  const [template, setTemplate] = useState<Template | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [activeTab, setActiveTab] = useState('edit');

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

  const handleSave = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in or create an account to save documents.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would save to Supabase
    toast({
      title: "Document saved",
      description: "Your document has been saved successfully.",
    });
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

  const handleShare = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in or create an account to share documents.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would create a sharing link
    toast({
      title: "Share link created",
      description: "A sharing link has been copied to your clipboard.",
    });
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
    handleLoginRedirect
  };
};
