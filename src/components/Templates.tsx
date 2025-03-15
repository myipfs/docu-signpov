
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Pen, FileCheck, FileSignature, UserCheck, Home, Briefcase, Shield, FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TemplateEditor } from './TemplateEditor';
import { toast } from '@/utils/toast';

interface Template {
  id: string;
  title: string;
  description: string;
  details: string;
  category: 'contract' | 'agreement' | 'form' | 'legal';
  popular: boolean;
  icon: React.ReactNode;
}

export default function Templates() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'nda-template',
      title: 'Non-Disclosure Agreement',
      description: 'Protect sensitive information when dealing with contractors, employees, or business partners.',
      details: 'This comprehensive NDA template includes clauses for confidential information definition, exclusions, obligations of receiving parties, and remedies for breach.',
      category: 'legal',
      popular: true,
      icon: <Shield size={20} />
    },
    {
      id: 'employment-contract',
      title: 'Employment Contract',
      description: 'Standard employment agreement outlining roles, compensation, and terms.',
      details: 'Includes sections for job responsibilities, compensation package, benefits, PTO policy, termination conditions, and intellectual property rights.',
      category: 'contract',
      popular: true,
      icon: <Briefcase size={20} />
    },
    {
      id: 'rental-agreement',
      title: 'Rental Agreement',
      description: 'Property rental contract with terms for both landlords and tenants.',
      details: 'Covers rent amount, security deposit, maintenance responsibilities, pet policies, lease duration, and early termination conditions.',
      category: 'agreement',
      popular: true,
      icon: <Home size={20} />
    },
    {
      id: 'service-agreement',
      title: 'Service Agreement',
      description: 'Clear terms for service providers and clients to avoid misunderstandings.',
      details: 'Outlines scope of services, payment terms, timeline for delivery, quality standards, liability limitations, and dispute resolution process.',
      category: 'agreement',
      popular: false,
      icon: <FileCheck size={20} />
    },
    {
      id: 'invoice-template',
      title: 'Invoice Template',
      description: 'Professional invoice template for billing clients or customers.',
      details: 'Includes company details, client information, itemized services/products, payment terms, tax calculations, and multiple payment method options.',
      category: 'form',
      popular: true,
      icon: <FileSpreadsheet size={20} />
    },
    {
      id: 'consent-form',
      title: 'Consent Form',
      description: 'General consent form for obtaining permission for various activities.',
      details: 'Customizable template with clear language explaining rights, risks, benefits, and ability to withdraw consent at any time.',
      category: 'form',
      popular: false,
      icon: <UserCheck size={20} />
    },
    {
      id: 'consulting-agreement',
      title: 'Consulting Agreement',
      description: 'Define the scope and terms of consulting services.',
      details: 'Comprehensive template covering consultant obligations, client responsibilities, fee structure, work product ownership, and confidentiality provisions.',
      category: 'contract',
      popular: true,
      icon: <FileSignature size={20} />
    },
    {
      id: 'partnership-agreement',
      title: 'Partnership Agreement',
      description: 'Establish terms between business partners with clear expectations.',
      details: 'Includes capital contributions, profit/loss distribution, management responsibilities, dispute resolution, and partnership dissolution procedures.',
      category: 'legal',
      popular: false,
      icon: <Briefcase size={20} />
    },
    {
      id: 'equipment-lease',
      title: 'Equipment Lease Agreement',
      description: 'Document the terms for leasing equipment to businesses or individuals.',
      details: 'Covers equipment description, lease duration, payment schedule, maintenance responsibilities, insurance requirements, and end-of-lease options.',
      category: 'agreement',
      popular: false,
      icon: <FileText size={20} />
    }
  ]);
  
  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'contract', name: 'Contracts' },
    { id: 'agreement', name: 'Agreements' },
    { id: 'form', name: 'Forms' },
    { id: 'legal', name: 'Legal Documents' }
  ];
  
  const filteredTemplates = templates.filter(template => 
    activeCategory === 'all' || template.category === activeCategory
  );

  const handleEditClick = (template: Template) => {
    setEditingTemplate(template);
    setIsEditorOpen(true);
  };

  const handleSaveTemplate = (updatedTemplate: Template) => {
    setTemplates(prevTemplates => 
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
    // In a real app, this would download the template
    toast({
      title: "Template downloaded",
      description: "The template has been downloaded successfully.",
    });
  };

  return (
    <section id="templates" className="py-20 px-4 bg-secondary/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Popular <span className="text-gradient">Templates</span>
          </h2>
          <p className="max-w-2xl mx-auto text-foreground/70 mb-8">
            Get started quickly with our most popular document templates
          </p>
          
          {/* Category tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className="rounded-full"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id}
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
                    onClick={() => handleDownload(template.id)}
                  >
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="rounded-lg flex-1"
                    onClick={() => handleEditClick(template)}
                  >
                    <Pen size={16} className="mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="rounded-lg px-8">
            <Link to="/dashboard">View All Templates</Link>
          </Button>
        </div>
      </div>

      {/* Template Editor Dialog */}
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
