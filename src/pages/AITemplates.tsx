import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  MessageSquare, 
  Search, 
  PenTool, 
  Building2, 
  Scale,
  Sparkles,
  Lock
} from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import { toast } from '@/utils/toast';

const AITemplates = () => {
  const navigate = useNavigate();
  const { session, user } = useSession();
  
  const handleTemplateClick = (templateId: string) => {
    if (!session) {
      navigate('/auth', { state: { returnTo: '/ai-templates' } });
      return;
    }
    
    // Navigate to AI workflow interface
    navigate(`/ai-workflow/${templateId}`);
  };

  const aiTemplates = [
    {
      id: 'chat-pdf',
      title: 'Chat with PDF',
      description: 'Upload any PDF document and have a conversation with it. Ask questions, get summaries, and extract key information instantly.',
      icon: MessageSquare,
      category: 'Document Analysis',
      features: ['Natural language queries', 'Instant answers', 'Source citations', 'Multi-document support']
    },
    {
      id: 'document-query',
      title: 'Document Query & Summary',
      description: 'Query any document format and get instant answers, summaries, and insights. Perfect for research and analysis.',
      icon: Search,
      category: 'Document Analysis',
      features: ['Smart summarization', 'Key point extraction', 'Multiple format support', 'Export results']
    },
    {
      id: 'proposal-drafter',
      title: 'AI Proposal Drafter',
      description: 'Create professional business proposals with AI assistance. Input your requirements and get a polished proposal.',
      icon: PenTool,
      category: 'Business Documents',
      features: ['Custom templates', 'Industry-specific content', 'Professional formatting', 'Revision suggestions']
    },
    {
      id: 'offer-letter-generator',
      title: 'Offer Letter Generator',
      description: 'Generate professional offer letters with AI. Customize terms, benefits, and legal compliance automatically.',
      icon: Building2,
      category: 'HR Documents',
      features: ['Legal compliance', 'Custom terms', 'Multiple templates', 'Automatic formatting']
    },
    {
      id: 'legal-research',
      title: 'Legal Document Research',
      description: 'Research legal documents to get summaries, recommendations, and use as foundation for new legal documents.',
      icon: Scale,
      category: 'Legal Research',
      features: ['Case law analysis', 'Legal precedents', 'Recommendation engine', 'Citation tracking']
    },
    {
      id: 'contract-analyzer',
      title: 'Contract Analyzer',
      description: 'Upload contracts and get AI-powered analysis including risk assessment, key terms extraction, and suggestions.',
      icon: FileText,
      category: 'Legal Research',
      features: ['Risk assessment', 'Key terms extraction', 'Compliance checking', 'Amendment suggestions']
    }
  ];

  const categories = ['All', 'Document Analysis', 'Business Documents', 'HR Documents', 'Legal Research'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredTemplates = selectedCategory === 'All' 
    ? aiTemplates 
    : aiTemplates.filter(template => template.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI Pro Features</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Agentic AI <span className="text-gradient">Workflows</span>
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Supercharge your document workflows with AI-powered automation. Chat with documents, 
              generate proposals, analyze contracts, and research legal documents with intelligent assistance.
            </p>
          </div>

          {/* AI Pro Badge */}
          <div className="flex justify-center mb-12">
            <div className="glass-card p-6 rounded-xl border-2 border-primary/20 max-w-2xl">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="h-5 w-5 text-primary" />
                <span className="font-semibold">AI Pro Subscription Required</span>
              </div>
              <p className="text-foreground/70 mb-4">
                These advanced AI features are available with the AI Pro plan ($20/month). 
                Unlock powerful agentic workflows and automation for your documents.
              </p>
              <Button onClick={() => navigate('/plans')} className="w-full">
                Upgrade to AI Pro - $20/month
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* AI Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => {
              const IconComponent = template.icon;
              return (
                <Card 
                  key={template.id} 
                  className="glass-card border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleTemplateClick(template.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-purple-600/10 group-hover:from-primary/20 group-hover:to-purple-600/20 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {template.title}
                    </CardTitle>
                    <CardDescription className="text-foreground/70">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-foreground/80">Key Features:</h4>
                      <ul className="space-y-2">
                        {template.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-foreground/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full mt-6 group-hover:scale-105 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateClick(template.id);
                      }}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Try AI Workflow
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="glass-card p-8 rounded-xl border-2 border-primary/10 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Workflow?</h2>
              <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
                Join thousands of professionals who are already using AI to streamline their document 
                processes, save time, and make smarter decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/plans')}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start AI Pro Trial
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AITemplates;