
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Template } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Download, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TemplateCardProps {
  template: Template;
  onEdit?: (template: Template) => void;
  onDownload?: (template: Template) => void;
}

export function TemplateCard({ template, onEdit, onDownload }: TemplateCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-200 group hover:shadow-md">
      <CardContent className="p-0">
        <div 
          className="h-40 bg-gradient-to-b from-primary/10 to-primary/5 flex items-center justify-center p-6"
        >
          {template.icon}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
            {template.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {template.description}
          </p>
          <div className="flex text-xs text-muted-foreground space-x-4">
            {template.date && (
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {template.date}
              </span>
            )}
            {template.readTime && (
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {template.readTime} min
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 bg-muted/30 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => onEdit && onEdit(template)}
        >
          <Edit className="h-3.5 w-3.5 mr-1" />
          Customize
        </Button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => onDownload && onDownload(template)}
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            Download
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="text-xs"
            asChild
          >
            <Link to={`/templates/edit/${template.id}`}>
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit Online
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
