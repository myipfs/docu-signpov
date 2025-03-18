
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TemplateEditor } from './TemplateEditor';
import { toast } from '@/utils/toast';
import { TemplateCategories } from '@/components/template/TemplateCategories';
import { TemplateGrid } from './template/TemplateGrid';
import { Template } from '@/types/template';
import { templates } from '@/data/templateData';

interface TemplatesProps {
  initialCategory?: string;
}

export default function Templates({ initialCategory = 'all' }: TemplatesProps) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [templateData, setTemplateData] = useState<Template[]>(templates);
  
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);
  
  const filteredTemplates = templateData.filter(template => 
    activeCategory === 'all' || template.category === activeCategory
  );

  const handleEditClick = (template: Template) => {
    setEditingTemplate(template);
    setIsEditorOpen(true);
  };

  const handleSaveTemplate = (updatedTemplate: Template) => {
    setTemplateData(prevTemplates => 
      prevTemplates.map(template => 
        template.id === updatedTemplate.id ? updatedTemplate : template
      )
    );
    toast({
      title: "Template updated",
      description: `"${updatedTemplate.title}" has been updated successfully.`,
    });
  };

  const handleDownload = (templateId: string) => {
    toast({
      title: "Template downloaded",
      description: "The template has been downloaded successfully.",
    });
  };

  return (
    <section id="templates" className="py-10 px-4 bg-secondary/20 rounded-lg">
      <div className="container mx-auto max-w-6xl">
        {!initialCategory && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Popular <span className="text-gradient">Templates</span>
            </h2>
            <p className="max-w-2xl mx-auto text-foreground/70 mb-8">
              Get started quickly with our most popular document templates
            </p>
          </div>
        )}
        
        <TemplateCategories 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        <TemplateGrid 
          templates={filteredTemplates}
          onEdit={handleEditClick}
          onDownload={handleDownload}
        />
        
        {!initialCategory && (
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="rounded-lg px-8">
              <Link to="/templates">View All Templates</Link>
            </Button>
          </div>
        )}
      </div>

      {editingTemplate && (
        <TemplateEditor 
          template={editingTemplate}
          open={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveTemplate}
        />
      )}
    </section>
  );
}
