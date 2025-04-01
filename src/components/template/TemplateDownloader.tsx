
import React from 'react';
import { Template } from '@/types/template';
import { toast } from '@/utils/toast';
import { generateTemplateContent } from '@/utils/templateGenerators';

export const useTemplateDownloader = () => {
  const handleDownload = (template: Template) => {
    // Create template content based on the template type
    let content = generateTemplateContent(template);
    
    // Create a blob with the content
    const blob = new Blob([content], { type: 'text/plain' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    
    // Add to DOM, trigger download, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Template downloaded",
      description: `"${template.title}" has been downloaded successfully.`,
    });
  };
  
  return { handleDownload };
};
