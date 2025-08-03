
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { CheckCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const PricingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Choose Your <span className="text-gradient">Plan</span></h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Start signing documents for free or upgrade for additional storage and features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="glass-card p-8 rounded-xl border-2 border-primary/10 flex flex-col h-full">
              <div className="mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  Free Forever
                </div>
                <h2 className="text-3xl font-bold mb-2">Free</h2>
                <p className="text-foreground/70">Get started with essential features</p>
              </div>
              
              <div className="text-3xl font-bold mb-6">$0</div>
              <p className="text-sm text-foreground/60 mb-6">Support with donations</p>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>500MB storage</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Basic document templates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>5 signature documents per month</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Email support</span>
                </li>
              </ul>
              
              <div className="flex flex-col gap-2">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/dashboard">Get Started</Link>
                </Button>
                <Button 
                  asChild
                  variant="ghost" 
                  size="sm"
                  className="w-full text-xs"
                >
                  <a href="https://buymeacoffee.com/signpov" target="_blank" rel="noopener noreferrer">
                    ☕ Buy me a coffee
                  </a>
                </Button>
              </div>
            </div>
            
            {/* Premium Plan */}
            <div className="glass-card p-8 rounded-xl border-2 border-primary relative flex flex-col h-full">
              <div className="absolute -top-4 inset-x-0 flex justify-center">
                <div className="px-4 py-1 bg-primary text-white text-sm font-medium rounded-full">
                  Most Popular
                </div>
              </div>
              
              <div className="mb-6 mt-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  Premium
                </div>
                <h2 className="text-3xl font-bold mb-2">Premium</h2>
                <p className="text-foreground/70">Enhanced features for professionals</p>
              </div>
              
              <div className="text-3xl font-bold mb-6">$5<span className="text-lg font-normal text-foreground/70">/month</span></div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>1GB</strong> storage (2x more than Free)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>All templates included</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Unlimited signature requests</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Custom branding options</span>
                </li>
              </ul>
              
              <Button asChild className="w-full">
                <a href="https://buy.stripe.com/cNi28q1G85x9eYD8cwcwg00" target="_blank" rel="noopener noreferrer">
                  Upgrade Now
                </a>
              </Button>
            </div>
            
            {/* AI Pro Plan */}
            <div className="glass-card p-8 rounded-xl border-2 border-primary/10 relative flex flex-col h-full">
              <div className="absolute -top-4 inset-x-0 flex justify-center">
                <div className="px-4 py-1 bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-medium rounded-full">
                  🤖 AI Powered
                </div>
              </div>
              
              <div className="mb-6 mt-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary text-xs font-medium mb-4">
                  AI Pro
                </div>
                <h2 className="text-3xl font-bold mb-2">AI Pro</h2>
                <p className="text-foreground/70">Agentic AI workflows & automation</p>
              </div>
              
              <div className="text-3xl font-bold mb-6">$18<span className="text-lg font-normal text-foreground/70">/month</span></div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Everything in Premium</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>5GB</strong> storage (5x more)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>🤖 Chat with PDF documents</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>🤖 AI Proposal Drafter</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>🤖 Offer Letter Generator</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>🤖 Legal Document Research</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>🤖 Document Query & Summary</span>
                </li>
              </ul>
              
              <Button asChild className="w-full">
                <a href="https://buy.stripe.com/dRm9ASacE6BdeYD64ocwg01" target="_blank" rel="noopener noreferrer">
                  Upgrade to AI Pro
                </a>
              </Button>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-3">Is there really a free plan?</h3>
                <p className="text-foreground/70">
                  Yes! Our free plan offers 500MB of storage and 5 signature documents per month forever.
                  It's perfect for individuals and small businesses with occasional signing needs.
                </p>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-3">What counts as a signature document?</h3>
                <p className="text-foreground/70">
                  A signature document is counted each time you upload a document for signing or use a template.
                  For free users, this includes personal document signing. Sending signature requests to others
                  is only available on paid plans.
                </p>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-3">What premium features are included?</h3>
                <p className="text-foreground/70">
                  Premium plans include unlimited storage, advanced analytics, priority support, and 
                  access to AI-powered document generation tools.
                </p>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-3">Are signed documents legally binding?</h3>
                <p className="text-foreground/70">
                  Yes, documents signed through SignPov are legally binding in most jurisdictions.
                  We comply with ESIGN, UETA, and eIDAS regulations, and provide audit trails for
                  legal verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
