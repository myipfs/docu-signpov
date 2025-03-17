
import React from 'react';
import { TemplateCard } from './TemplateCard';
import { Template } from '@/types/template';

interface TemplateGridProps {
  templates: Template[];
  onEdit: (template: Template) => void;
  onDownload: (templateId: string) => void;
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({
  templates,
  onEdit,
  onDownload
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onEdit={onEdit}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
};
