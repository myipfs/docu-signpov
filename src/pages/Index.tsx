
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Templates from '@/components/Templates';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const Index = () => {
  console.log("Rendering Index page"); // Debug log

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Templates />
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 px-4 bg-secondary/50">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                How It <span className="text-gradient">Works</span>
              </h2>
              <p className="max-w-2xl mx-auto text-foreground/70">
                Sign documents in three simple steps
              </p>
            </div>
            
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-0.5 h-[calc(100%-6rem)] bg-primary/20 hidden md:block"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="glass-card p-6 rounded-xl relative">
                  <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-full font-bold text-xl mb-4 mx-auto md:mx-0">
                    1
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-center md:text-left">Upload Document</h3>
                  <p className="text-foreground/70 text-sm">
                    Upload any document format with our simple drag-and-drop interface or file browser.
                  </p>
                </div>
                
                {/* Step 2 */}
                <div className="glass-card p-6 rounded-xl relative">
                  <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-full font-bold text-xl mb-4 mx-auto md:mx-0">
                    2
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-center md:text-left">Add Signature Fields</h3>
                  <p className="text-foreground/70 text-sm">
                    Drag and drop signature fields onto your document where you need signatures.
                  </p>
                </div>
                
                {/* Step 3 */}
                <div className="glass-card p-6 rounded-xl relative">
                  <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-full font-bold text-xl mb-4 mx-auto md:mx-0">
                    3
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-center md:text-left">Sign & Share</h3>
                  <p className="text-foreground/70 text-sm">
                    Sign the document yourself or invite others to sign with automatic email notifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section id="pricing" className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Simple <span className="text-gradient">Pricing</span>
              </h2>
              <p className="max-w-2xl mx-auto text-foreground/70">
                Start signing documents for free, no credit card required
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="glass-card p-8 rounded-xl border-2 border-primary/10">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
                  Free Forever
                </div>
                <h3 className="text-4xl font-bold mb-2">$0</h3>
                <p className="text-foreground/70 mb-6">500MB storage</p>
                
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span>Upload any document format</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span>Electronic signatures</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span>5 signature requests/month</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span>Basic templates</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span>Email support</span>
                  </li>
                </ul>
                
                <Link to="/auth" className="inline-flex justify-center items-center w-full py-3 px-6 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors">
                  Get Started
                </Link>
              </div>
              
              {/* Premium Plan */}
              <div className="glass-card p-8 rounded-xl border-2 border-primary relative">
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <div className="px-4 py-1 bg-primary text-white text-sm font-medium rounded-full">
                    Recommended
                  </div>
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
                  Premium
                </div>
                <h3 className="text-4xl font-bold mb-2">$4.99<span className="text-lg font-normal text-foreground/70">/mo</span></h3>
                <p className="text-foreground/70 mb-6">1GB storage</p>
                
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span>All features in Free</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span>Unlimited signature requests</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span>All premium templates</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span>Custom branding</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span>Priority support</span>
                  </li>
                </ul>
                
                <Link to="/plans" className="inline-flex justify-center items-center w-full py-3 px-6 rounded-lg border-2 border-primary bg-transparent hover:bg-primary/10 text-primary font-medium transition-colors">
                  View Plans
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
