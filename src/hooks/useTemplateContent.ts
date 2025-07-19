
import { useState, useEffect } from 'react';
import { Template } from '@/types/template';
import { generateTemplateContent } from '@/utils/templates';
import { toast } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

export const useTemplateContent = (templateId: string | undefined, templates: Template[]) => {
  const navigate = useNavigate();
  
  const [template, setTemplate] = useState<Template | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [activeTab, setActiveTab] = useState('preview'); // Start with preview to show template content

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

  return {
    template,
    documentTitle,
    setDocumentTitle,
    content,
    setContent,
    originalContent,
    activeTab,
    setActiveTab
  };
};
