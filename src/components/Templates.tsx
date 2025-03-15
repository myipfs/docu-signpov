
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Pen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Template {
  id: string;
  title: string;
  description: string;
  category: 'contract' | 'agreement' | 'form' | 'legal';
  popular: boolean;
}

export default function Templates() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const templates: Template[] = [
    {
      id: 'nda-template',
      title: 'Non-Disclosure Agreement',
      description: 'Protect sensitive information when dealing with contractors, employees, or business partners.',
      category: 'legal',
      popular: true
    },
    {
      id: 'employment-contract',
      title: 'Employment Contract',
      description: 'Standard employment agreement outlining roles, compensation, and terms.',
      category: 'contract',
      popular: true
    },
    {
      id: 'rental-agreement',
      title: 'Rental Agreement',
      description: 'Property rental contract with terms for both landlords and tenants.',
      category: 'agreement',
      popular: true
    },
    {
      id: 'service-agreement',
      title: 'Service Agreement',
      description: 'Clear terms for service providers and clients to avoid misunderstandings.',
      category: 'agreement',
      popular: false
    },
    {
      id: 'invoice-template',
      title: 'Invoice Template',
      description: 'Professional invoice template for billing clients or customers.',
      category: 'form',
      popular: true
    },
    {
      id: 'consent-form',
      title: 'Consent Form',
      description: 'General consent form for obtaining permission for various activities.',
      category: 'form',
      popular: false
    }
  ];
  
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
                "glass-card overflow-hidden transition-all duration-200 hover:shadow-md",
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
                  <FileText size={20} />
                </div>
                
                <h3 className="text-xl font-medium mb-2">{template.title}</h3>
                <p className="text-foreground/70 text-sm mb-6">{template.description}</p>
                
                <div className="flex space-x-3 mt-auto">
                  <Button variant="outline" size="sm" className="rounded-lg flex-1">
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                  <Button variant="default" size="sm" className="rounded-lg flex-1">
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
    </section>
  );
}
