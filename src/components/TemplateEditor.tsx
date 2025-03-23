
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/utils/toast';
import { Pen, Save, X } from 'lucide-react';
import { Template } from '@/types/template';
import TextEditor from '@/components/TextEditor';

interface TemplateEditorProps {
  template: Template;
  open: boolean;
  onClose: () => void;
  onSave: (updatedTemplate: Template) => void;
}

export function TemplateEditor({ template, open, onClose, onSave }: TemplateEditorProps) {
  const [editedTemplate, setEditedTemplate] = useState<Template>({ ...template });
  const [detailsContent, setDetailsContent] = useState(template.details);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedTemplate(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!editedTemplate.title.trim() || !editedTemplate.description.trim()) {
      toast({
        title: "Missing required fields",
        description: "Title and description are required.",
        variant: "destructive"
      });
      return;
    }

    // Update the details with the content from the text editor
    const updatedTemplate = {
      ...editedTemplate,
      details: detailsContent
    };

    onSave(updatedTemplate);
    toast({
      title: "Template updated",
      description: "Your template has been successfully updated.",
    });
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[90vw] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Pen size={18} />
            Edit Template
          </SheetTitle>
          <SheetDescription>
            Make changes to your template. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={editedTemplate.title}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Short Description
            </label>
            <Input
              id="description"
              name="description"
              value={editedTemplate.description}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={editedTemplate.category}
              onChange={(e) => {
                const value = e.target.value as Template["category"];
                setEditedTemplate(prev => ({ ...prev, category: value }));
              }}
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium"
            >
              <option value="contract">Contract</option>
              <option value="agreement">Agreement</option>
              <option value="form">Form</option>
              <option value="legal">Legal</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="popular"
              checked={editedTemplate.popular}
              onChange={(e) => setEditedTemplate(prev => ({ ...prev, popular: e.target.checked }))}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="popular" className="text-sm text-muted-foreground">
              Mark as popular template
            </label>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="details" className="text-sm font-medium">
              Details
            </label>
            <div className="border rounded-md overflow-hidden">
              <TextEditor 
                content={detailsContent} 
                setContent={setDetailsContent} 
              />
            </div>
          </div>
        </div>
        
        <SheetFooter className="pt-4">
          <Button variant="outline" onClick={onClose} className="gap-2">
            <X size={16} />
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save size={16} />
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
