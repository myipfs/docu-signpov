
import React from 'react';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/templateData';

interface TemplateCategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const TemplateCategories: React.FC<TemplateCategoriesProps> = ({ 
  activeCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {categories.map(category => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className="rounded-full"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};
