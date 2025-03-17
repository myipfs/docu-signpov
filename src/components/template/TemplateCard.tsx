
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Pen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Template } from '@/types/template';

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDownload: (templateId: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  onEdit, 
  onDownload 
}) => {
  return (
    <Card 
      className={cn(
        "glass-card overflow-hidden transition-all duration-200 hover:shadow-md template-card-hover",
        template.popular && "border-primary/20"
      )}
    >
      <div className="h-3 w-full bg-gradient-to-r from-primary/60 to-blue-500/60"></div>
      
      <CardContent className="p-6">
        {template.popular && (
          <div className="absolute top-5 right-5">
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              Popular
            </span>
          </div>
        )}
        
        <div className="mb-4 bg-primary/10 text-primary p-3 rounded-lg inline-block">
          {template.icon}
        </div>
        
        <h3 className="text-xl font-medium mb-2">{template.title}</h3>
        <p className="text-foreground/70 text-sm mb-3">{template.description}</p>
        <p className="text-foreground/60 text-xs mb-6 line-clamp-3">{template.details}</p>
        
        <div className="flex space-x-3 mt-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-lg flex-1"
            onClick={() => onDownload(template.id)}
          >
            <Download size={16} className="mr-2" />
            Download
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="rounded-lg flex-1"
            onClick={() => onEdit(template)}
          >
            <Pen size={16} className="mr-2" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
