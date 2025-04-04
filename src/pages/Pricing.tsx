
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
            <h1 className="text-4xl font-bold mb-4">Simple, <span className="text-gradient">Transparent</span> Pricing</h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Start signing documents for free. No credit card required.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="glass-card p-8 rounded-xl border-2 border-primary/10 flex flex-col h-full">
              <div className="mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  Free Forever
                </div>
                <h2 className="text-3xl font-bold mb-2">Free</h2>
                <p className="text-foreground/70">Essential features for individuals</p>
              </div>
              
              <div className="text-3xl font-bold mb-6">$0</div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Unlimited document uploads</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>5 signature requests per month</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Basic document templates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Email support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Standard security</span>
                </li>
              </ul>
              
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard">
                  Get Started
                </Link>
              </Button>
            </div>
            
            {/* Pro Plan */}
            <div className="glass-card p-8 rounded-xl border-2 border-primary relative flex flex-col h-full">
              <div className="absolute -top-4 inset-x-0 flex justify-center">
                <div className="px-4 py-1 bg-primary text-white text-sm font-medium rounded-full">
                  Most Popular
                </div>
              </div>
              
              <div className="mb-6 mt-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  Pro
                </div>
                <h2 className="text-3xl font-bold mb-2">Professional</h2>
                <p className="text-foreground/70">Advanced features for professionals</p>
              </div>
              
              <div className="text-3xl font-bold mb-6">Coming Soon</div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Unlimited signature requests</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Custom branding</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Advanced templates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <div className="flex items-center">
                    <span>API access</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-foreground/40 ml-1.5 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">
                            Integrate SignPov with your existing systems through our REST API
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
              
              <Button asChild className="w-full">
                <Link to="/dashboard">
                  Join Waitlist
                </Link>
              </Button>
            </div>
            
            {/* Enterprise Plan */}
            <div className="glass-card p-8 rounded-xl border-2 border-primary/10 flex flex-col h-full">
              <div className="mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  Enterprise
                </div>
                <h2 className="text-3xl font-bold mb-2">Enterprise</h2>
                <p className="text-foreground/70">For organizations with specific needs</p>
              </div>
              
              <div className="text-3xl font-bold mb-6">Custom</div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Everything in Professional</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>SSO authentication</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Enterprise SLA</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Advanced security options</span>
                </li>
              </ul>
              
              <Button asChild variant="outline" className="w-full">
                <Link to="/contact">
                  Contact Sales
                </Link>
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
                  Yes! Our free plan offers unlimited document uploads and 5 signature requests per month forever.
                  It's perfect for individuals and small businesses with occasional signing needs.
                </p>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-3">What counts as a signature request?</h3>
                <p className="text-foreground/70">
                  A signature request is counted each time you send a document to be signed, regardless
                  of how many signatures are needed on the document. Multiple signers on one document
                  still count as one request.
                </p>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-3">Can I cancel or change my plan anytime?</h3>
                <p className="text-foreground/70">
                  Absolutely. You can upgrade, downgrade, or cancel your plan at any time. 
                  If you cancel, you'll continue to have access to your plan's features until the end
                  of your billing period.
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
