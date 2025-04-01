
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, FileText, Download, Share2, ArrowLeft, LogIn } from 'lucide-react';
import TextEditor from '@/components/TextEditor';
import { toast } from '@/utils/toast';
import { Template } from '@/types/template';
import { templates } from '@/data/templateData';
import { useSession } from '@/context/SessionContext';

const TemplateEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useSession();
  const isAuthenticated = !!session?.user;
  
  const [template, setTemplate] = useState<Template | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [activeTab, setActiveTab] = useState('edit');

  useEffect(() => {
    if (id) {
      const foundTemplate = templates.find(t => t.id === id);
      if (foundTemplate) {
        setTemplate(foundTemplate);
        setDocumentTitle(foundTemplate.title);
        
        // Generate template content based on the template category
        const generatedContent = generateTemplateContent(foundTemplate);
        setContent(generatedContent);
        setOriginalContent(generatedContent);
      } else {
        toast({
          title: "Template not found",
          description: "The requested template could not be found.",
          variant: "destructive"
        });
        navigate('/templates');
      }
    }
  }, [id, navigate]);

  const handleSave = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in or create an account to save documents.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would save to Supabase
    toast({
      title: "Document saved",
      description: "Your document has been saved successfully.",
    });
  };

  const handleDownload = () => {
    // Create a blob with the content
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and click it
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Document downloaded",
      description: "Your document has been downloaded successfully.",
    });
  };

  const handleShare = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in or create an account to share documents.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would create a sharing link
    toast({
      title: "Share link created",
      description: "A sharing link has been copied to your clipboard.",
    });
  };

  const handleLoginRedirect = () => {
    // Save current state to localStorage or URL params if needed
    navigate('/auth', { state: { returnTo: window.location.pathname } });
  };

  const handleBackToTemplates = () => {
    navigate('/templates');
  };

  // Function to generate template content based on template type
  const generateTemplateContent = (template: Template): string => {
    if (!template) return '';
    
    // Generate appropriate content based on template type
    const currentDate = new Date().toLocaleDateString();
    
    let content = `# ${template.title}\n`;
    content += `# Generated on: ${currentDate}\n\n`;
    content += `${template.description}\n\n`;
    
    // Generate specific content based on template category
    switch(template.category) {
      case 'legal':
        content += generateLegalTemplate(template);
        break;
      case 'contract':
        content += generateContractTemplate(template);
        break;
      case 'agreement':
        content += generateAgreementTemplate(template);
        break;
      case 'form':
        content += generateFormTemplate(template);
        break;
      default:
        content += template.details;
    }
    
    return content;
  };
  
  // Generate specific content for each template type
  const generateLegalTemplate = (template: Template): string => {
    return `LEGAL DOCUMENT: ${template.title.toUpperCase()}

THIS DOCUMENT is effective as of [DATE]

BETWEEN:
[PARTY A NAME], with an address at [PARTY A ADDRESS]
("Party A")

AND:
[PARTY B NAME], with an address at [PARTY B ADDRESS]
("Party B")

WHEREAS:
1. [Insert relevant background]
2. [Insert purpose of agreement]

NOW THEREFORE in consideration of the mutual covenants contained herein and other good and valuable consideration, the receipt and sufficiency of which is hereby acknowledged, the parties agree as follows:

1. DEFINITIONS
   1.1 "[Term]" means [definition].
   1.2 "[Term]" means [definition].

2. RIGHTS AND OBLIGATIONS
   2.1 [Party A] shall [obligation].
   2.2 [Party B] shall [obligation].

3. TERM AND TERMINATION
   3.1 This Agreement shall commence on [START DATE] and continue until [END DATE], unless terminated earlier in accordance with this Agreement.
   3.2 Either party may terminate this Agreement by providing [NOTICE PERIOD] written notice to the other party.

4. CONFIDENTIALITY
   4.1 Each party acknowledges that it may receive confidential information from the other party.
   4.2 Each party agrees to maintain the confidentiality of all such information.

5. GOVERNING LAW
   5.1 This Agreement shall be governed by and construed in accordance with the laws of [JURISDICTION].

6. SIGNATURES
   6.1 This Agreement may be executed in counterparts.
   6.2 Electronic signatures shall be deemed to be original signatures.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

[PARTY A NAME]
By: ____________________________
Name: 
Title: 
Date: 

[PARTY B NAME]
By: ____________________________
Name: 
Title: 
Date: 

${template.details}`;
  };
  
  const generateContractTemplate = (template: Template): string => {
    return `CONTRACT: ${template.title.toUpperCase()}

EFFECTIVE DATE: [DATE]

PARTIES:
1. [CONTRACTOR NAME], with an address at [CONTRACTOR ADDRESS] ("Contractor")
2. [CLIENT NAME], with an address at [CLIENT ADDRESS] ("Client")

SERVICES:
The Contractor shall provide the following services to the Client:
1. [Describe service 1]
2. [Describe service 2]
3. [Describe service 3]

COMPENSATION:
1. The Client shall pay the Contractor [AMOUNT] per [HOUR/DAY/WEEK/MONTH/PROJECT].
2. Payment shall be made within [NUMBER] days of receiving an invoice from the Contractor.
3. The Contractor shall submit invoices [WEEKLY/MONTHLY/UPON COMPLETION].

TERM:
1. This Contract shall commence on [START DATE] and continue until [END DATE].
2. Either party may terminate this Contract by providing [NOTICE PERIOD] written notice.

INTELLECTUAL PROPERTY:
1. All intellectual property created by the Contractor in connection with the Services shall belong to the Client.
2. The Contractor shall not use the Client's intellectual property for any purpose other than performing the Services.

CONFIDENTIALITY:
1. The Contractor shall not disclose any confidential information of the Client to any third party.
2. This obligation shall survive the termination of this Contract.

SIGNATURES:

CLIENT:
Signature: _______________________
Name: 
Title: 
Date: 

CONTRACTOR:
Signature: _______________________
Name: 
Title: 
Date: 

${template.details}`;
  };
  
  const generateAgreementTemplate = (template: Template): string => {
    return `AGREEMENT: ${template.title.toUpperCase()}

THIS AGREEMENT is made and entered into as of [DATE] ("Effective Date")

BETWEEN:
[PARTY A], with an address at [ADDRESS] ("Party A")
AND
[PARTY B], with an address at [ADDRESS] ("Party B")

RECITALS:
A. [Background information]
B. [Purpose of agreement]

AGREEMENT:

1. PURPOSE
   1.1 The purpose of this Agreement is to [describe purpose].

2. TERMS
   2.1 [Party A] agrees to [obligation].
   2.2 [Party B] agrees to [obligation].
   2.3 The term of this Agreement shall be [DURATION].

3. CONSIDERATION
   3.1 In consideration for [service/item], [Party] shall pay [amount] to [Party].
   3.2 Payment shall be made [payment terms].

4. REPRESENTATIONS AND WARRANTIES
   4.1 Each party represents and warrants that it has the full right and authority to enter into this Agreement.
   4.2 [Other representations and warranties]

5. TERMINATION
   5.1 This Agreement may be terminated by either party upon [NOTICE PERIOD] written notice.
   5.2 [Other termination provisions]

6. MISCELLANEOUS
   6.1 This Agreement constitutes the entire understanding between the parties.
   6.2 This Agreement shall be governed by the laws of [JURISDICTION].
   6.3 Any disputes arising from this Agreement shall be resolved through [DISPUTE RESOLUTION METHOD].

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

[PARTY A]
By: ____________________________
Name: 
Title: 
Date: 

[PARTY B]
By: ____________________________
Name: 
Title: 
Date: 

${template.details}`;
  };
  
  const generateFormTemplate = (template: Template): string => {
    return `FORM: ${template.title.toUpperCase()}

[ORGANIZATION NAME]
[ORGANIZATION ADDRESS]
[CITY, STATE ZIP]
[PHONE]
[EMAIL]

DATE: [DATE]

PERSONAL INFORMATION:
Full Name: _______________________________
Address: ________________________________
City, State, ZIP: _________________________
Phone: _________________________________
Email: _________________________________
Date of Birth: ___________________________

ADDITIONAL INFORMATION:
[FIELD 1]: ________________________________
[FIELD 2]: ________________________________
[FIELD 3]: ________________________________
[FIELD 4]: ________________________________
[FIELD 5]: ________________________________

CERTIFICATION:
I certify that the information provided above is true and accurate to the best of my knowledge.

Signature: _______________________________
Date: ___________________________________

OFFICE USE ONLY:
Received by: ____________________________
Date: __________________________________
Reference Number: _______________________

${template.details}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6 px-4">
        <div className="container mx-auto max-w-7xl">
          <Button 
            variant="ghost" 
            onClick={handleBackToTemplates} 
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <FileText className="text-primary" />
              <Input
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="text-xl font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                placeholder="Document Title"
              />
            </div>
            
            <div className="flex gap-2">
              {!isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={handleLoginRedirect}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login to Save
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
          
          <Card className="p-0 min-h-[calc(100vh-250px)]">
            <Tabs defaultValue="edit" className="w-full" onValueChange={setActiveTab}>
              <div className="border-b px-4">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="edit" className="p-0 m-0">
                <TextEditor 
                  content={content} 
                  setContent={setContent} 
                />
              </TabsContent>
              
              <TabsContent value="preview" className="p-6 m-0">
                {content ? (
                  <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                  <div className="text-center text-muted-foreground py-20">
                    <p>No content to preview yet.</p>
                    <p className="text-sm">Start editing to see a preview here.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TemplateEditor;
