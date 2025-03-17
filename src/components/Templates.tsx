
import React, { useState, useEffect } from 'react';
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

interface TemplatesProps {
  initialCategory?: string;
}

export default function Templates({ initialCategory = 'all' }: TemplatesProps) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);
  
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'nda-template',
      title: 'Non-Disclosure Agreement',
      description: 'Protect confidential information when sharing with third parties.',
      details: 'This comprehensive NDA template is based on industry standards and covers: (1) Clear definition of what constitutes confidential information (2) Specific exclusions from confidential information (3) Obligations of the receiving party including reasonable care standard (4) Term of confidentiality obligations (5) Return or destruction of confidential materials (6) Remedies for breach including injunctive relief (7) Standard exceptions for legally required disclosures (8) Non-solicitation provisions (9) Governing law and jurisdiction clauses (10) Severability provisions.',
      category: 'legal',
      popular: true,
      icon: <Shield size={20} />
    },
    {
      id: 'employment-contract',
      title: 'Employment Contract',
      description: 'Comprehensive agreement between employer and employee.',
      details: 'Based on standard employment law practices, this contract includes: (1) Detailed job description and responsibilities (2) Compensation structure including base salary, bonuses, and equity if applicable (3) Benefits package details including healthcare, retirement, and paid time off (4) Work schedule and location specifications (5) Confidentiality and intellectual property provisions (6) Non-compete and non-solicitation clauses with reasonable geographic and time limitations (7) Termination conditions including notice periods (8) Severance provisions (9) Dispute resolution process (10) Governing law provisions.',
      category: 'contract',
      popular: true,
      icon: <Briefcase size={20} />
    },
    {
      id: 'rental-agreement',
      title: 'Residential Lease Agreement',
      description: 'Comprehensive lease contract for residential properties.',
      details: 'This standardized lease agreement includes: (1) Property description and permitted use (2) Lease term with specific start and end dates (3) Rent amount, due dates, and acceptable payment methods (4) Security deposit amount and conditions for return (5) Utilities and maintenance responsibilities (6) Tenant alterations and improvements policies (7) Pet policies and associated deposits or fees (8) Rules regarding occupancy limits (9) Entry notice requirements (10) Default and remedies (11) Early termination conditions (12) Renewal terms and rent increase provisions.',
      category: 'agreement',
      popular: true,
      icon: <Home size={20} />
    },
    {
      id: 'service-agreement',
      title: 'Professional Services Agreement',
      description: 'Contract for service providers and clients with clear deliverables.',
      details: 'This service agreement template includes: (1) Detailed scope of services with specific deliverables (2) Project timeline with milestones (3) Payment terms including amount, schedule, and late payment penalties (4) Intellectual property ownership provisions (5) Confidentiality obligations (6) Representations and warranties (7) Limitation of liability clauses (8) Indemnification provisions (9) Termination rights and procedures (10) Change order process (11) Independent contractor relationship clarification (12) Force majeure provisions (13) Insurance requirements (14) Dispute resolution procedures.',
      category: 'agreement',
      popular: false,
      icon: <FileCheck size={20} />
    },
    {
      id: 'invoice-template',
      title: 'Professional Invoice Template',
      description: 'Comprehensive invoice with payment terms and itemization.',
      details: 'This professional invoice template includes: (1) Company name, logo, and contact information (2) Client details including billing address (3) Unique invoice number for tracking (4) Issue date and payment due date (5) Detailed itemization of products/services with descriptions, quantities, rates, and subtotals (6) Subtotal, tax calculations, and grand total (7) Payment terms and late payment policies (8) Accepted payment methods with relevant account details (9) Thank you message (10) Notes section for special instructions (11) Professional footer with business registration numbers and terms.',
      category: 'form',
      popular: true,
      icon: <FileSpreadsheet size={20} />
    },
    {
      id: 'consent-form',
      title: 'Informed Consent Form',
      description: 'Detailed consent form for medical, research, or participation purposes.',
      details: 'This comprehensive consent form includes: (1) Clear introduction explaining the purpose (2) Detailed explanation of procedures or activities (3) Specific risks and discomforts disclosure (4) Benefits section (5) Alternative procedures or options when applicable (6) Confidentiality and privacy protections (7) Compensation details if relevant (8) Emergency contact procedures (9) Voluntary participation statement and right to withdraw (10) Contact information for questions (11) Statement of consent with signature blocks (12) Witness signature section when required (13) Revocation section if applicable.',
      category: 'form',
      popular: false,
      icon: <UserCheck size={20} />
    },
    {
      id: 'consulting-agreement',
      title: 'Consulting Services Agreement',
      description: 'Contract for independent consultants with scope and deliverables.',
      details: 'This consulting agreement includes: (1) Detailed description of consulting services (2) Term of engagement with start and end dates (3) Compensation structure including hourly/daily rates or project fees (4) Payment schedule and invoicing procedures (5) Expense reimbursement policies (6) Deliverables and acceptance criteria (7) Independent contractor status clarification (8) Confidentiality provisions (9) Work product ownership (10) Non-solicitation clauses (11) Termination rights (12) Representations and warranties (13) Limitation of liability (14) Insurance requirements (15) Non-exclusivity provisions (16) Dispute resolution procedures.',
      category: 'contract',
      popular: true,
      icon: <FileSignature size={20} />
    },
    {
      id: 'partnership-agreement',
      title: 'General Partnership Agreement',
      description: 'Framework for business partnerships with profit sharing and roles.',
      details: 'This partnership agreement template includes: (1) Partnership name, purpose, and principal place of business (2) Term of partnership and conditions for dissolution (3) Capital contributions of each partner (4) Profit and loss allocation percentages (5) Distribution of profits schedule (6) Management structure and voting rights (7) Partner authority limitations (8) Meeting requirements and procedures (9) Bookkeeping and accounting procedures (10) Bank accounts and financial controls (11) Admission of new partners process (12) Voluntary and involuntary withdrawal provisions (13) Death or incapacity provisions (14) Dispute resolution procedures (15) Non-compete and confidentiality provisions.',
      category: 'legal',
      popular: false,
      icon: <Briefcase size={20} />
    },
    {
      id: 'equipment-lease',
      title: 'Equipment Lease Agreement',
      description: 'Contract for leasing business equipment with maintenance terms.',
      details: 'This equipment lease agreement includes: (1) Detailed equipment description with serial numbers and condition (2) Lease term with commencement and expiration dates (3) Lease payment amounts and schedule (4) Security deposit requirements (5) Delivery, installation, and acceptance procedures (6) Equipment use restrictions (7) Maintenance and repair responsibilities (8) Insurance requirements (9) Risk of loss provisions (10) Warranty provisions (11) Default and remedies (12) Early termination options (13) End of lease options (purchase, renewal, return) (14) Equipment return conditions (15) Indemnification clauses (16) Assignment restrictions.',
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
