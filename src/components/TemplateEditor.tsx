
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/utils/toast';
import { Pen, Save, X } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  details: string;
  category: 'contract' | 'agreement' | 'form' | 'legal';
  popular: boolean;
  icon: React.ReactNode;
}

interface TemplateEditorProps {
  template: Template;
  open: boolean;
  onClose: () => void;
  onSave: (updatedTemplate: Template) => void;
}

export function TemplateEditor({ template, open, onClose, onSave }: TemplateEditorProps) {
  const [editedTemplate, setEditedTemplate] = useState<Template>({ ...template });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    onSave(editedTemplate);
    toast({
      title: "Template updated",
      description: "Your template has been successfully updated.",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pen size={18} />
            Edit Template
          </DialogTitle>
          <DialogDescription>
            Make changes to your template. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="title" className="text-right text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={editedTemplate.title}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="description" className="text-right text-sm font-medium">
              Short Description
            </label>
            <Input
              id="description"
              name="description"
              value={editedTemplate.description}
              onChange={handleChange} 
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <label htmlFor="details" className="text-right text-sm font-medium pt-2">
              Details
            </label>
            <Textarea
              id="details"
              name="details"
              value={editedTemplate.details}
              onChange={handleChange}
              rows={5}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="category" className="text-right text-sm font-medium">
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
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium"
            >
              <option value="contract">Contract</option>
              <option value="agreement">Agreement</option>
              <option value="form">Form</option>
              <option value="legal">Legal</option>
            </select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">
              Popular
            </label>
            <div className="col-span-3 flex items-center space-x-2">
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
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="gap-2">
            <X size={16} />
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save size={16} />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
