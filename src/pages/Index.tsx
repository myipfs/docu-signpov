
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
        
      </main>
      <Footer />
    </div>
  );
};

export default Index;
