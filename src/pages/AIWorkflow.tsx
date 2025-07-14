import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  MessageSquare, 
  Search, 
  PenTool, 
  Building2, 
  Scale,
  Upload,
  Send,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/utils/toast';

const AIWorkflow = () => {
  const { workflowId } = useParams();
  const navigate = useNavigate();
  const { session } = useSession();
  const [prompt, setPrompt] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const workflowConfig = {
    'chat-pdf': {
      title: 'Chat with PDF',
      icon: MessageSquare,
      description: 'Upload a PDF and ask questions about its content',
      requiresFile: true,
      placeholder: 'Ask a question about the uploaded document...'
    },
    'document-query': {
      title: 'Document Query & Summary',
      icon: Search,
      description: 'Get summaries and insights from any document',
      requiresFile: true,
      placeholder: 'What would you like to know about this document?'
    },
    'proposal-drafter': {
      title: 'AI Proposal Drafter',
      icon: PenTool,
      description: 'Create professional business proposals',
      requiresFile: false,
      placeholder: 'Describe the proposal requirements (client, services, budget, timeline, etc.)...'
    },
    'offer-letter-generator': {
      title: 'Offer Letter Generator',
      icon: Building2,
      description: 'Generate professional offer letters',
      requiresFile: false,
      placeholder: 'Provide job details (position, salary, benefits, start date, company info, etc.)...'
    },
    'legal-research': {
      title: 'Legal Document Research',
      icon: Scale,
      description: 'Research and analyze legal documents',
      requiresFile: true,
      placeholder: 'What legal analysis or research do you need?'
    },
    'contract-analyzer': {
      title: 'Contract Analyzer',
      icon: FileText,
      description: 'Analyze contracts for risks and key terms',
      requiresFile: true,
      placeholder: 'What aspects of the contract would you like me to analyze?'
    }
  };

  const config = workflowConfig[workflowId as keyof typeof workflowConfig];

  if (!config) {
    navigate('/ai-templates');
    return null;
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    if (config.requiresFile && !fileContent) {
      toast({
        title: "File Required",
        description: "Please upload a document before submitting your query.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('moonshot-ai', {
        body: {
          prompt,
          type: workflowId,
          file_content: fileContent
        }
      });

      if (error) throw error;

      setResponse(data.response);
    } catch (error) {
      console.error('Error calling AI function:', error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const IconComponent = config.icon;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/ai-templates')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-purple-600/10">
                <IconComponent className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{config.title}</h1>
                <p className="text-foreground/70">{config.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Input</CardTitle>
                <CardDescription>
                  {config.requiresFile ? 'Upload your document and enter your query' : 'Enter your requirements'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {config.requiresFile && (
                  <div>
                    <Label htmlFor="file-upload">Upload Document</Label>
                    <div className="mt-2">
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".txt,.doc,.docx,.pdf"
                        onChange={handleFileUpload}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                      {fileName && (
                        <p className="text-sm text-foreground/70 mt-2">
                          <Upload className="h-4 w-4 inline mr-1" />
                          {fileName}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="prompt">
                      {config.requiresFile ? 'Your Question' : 'Requirements'}
                    </Label>
                    <Textarea
                      id="prompt"
                      placeholder={config.placeholder}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={6}
                      className="mt-2"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || !prompt.trim()}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Generate Response
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <CardTitle>AI Response</CardTitle>
                <CardDescription>
                  The AI-generated response will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {response ? (
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm p-4 rounded-lg bg-muted">
                      {response}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-foreground/50">
                    <IconComponent className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Submit your query to see the AI response</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIWorkflow;