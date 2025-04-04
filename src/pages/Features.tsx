
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturesSection from '@/components/Features';

const FeaturesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="py-12 px-4 bg-background">
          <div className="container mx-auto max-w-4xl text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Powerful <span className="text-gradient">Features</span></h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Everything you need to create, sign, and manage digital documents
            </p>
          </div>
        </div>
        
        {/* Reuse the Features component from the homepage */}
        <FeaturesSection />
        
        {/* Additional Features Section */}
        <section className="py-20 px-4 bg-secondary/50">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Advanced <span className="text-gradient">Features</span>
              </h2>
              <p className="max-w-2xl mx-auto text-foreground/70">
                Designed for professionals and teams
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-6 rounded-xl">
                <div className="bg-primary/10 text-primary p-3 rounded-lg inline-block mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3H5C3.89543 3 3 3.89543 3 5V9M9 3H15M9 3V9M15 3H19C20.1046 3 21 3.89543 21 5V9M15 3V9M3 9V15M3 9H9M9 9H15M15 9H21M21 9V15M3 15V19C3 20.1046 3.89543 21 5 21H9M3 15H9M9 15V21M9 15H15M9 21H15M15 21H19C20.1046 21 21 20.1046 21 19V15M15 21V15M15 15H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Document Templates</h3>
                <p className="text-foreground/70">
                  Create reusable templates for standard documents like contracts, agreements, and forms.
                  Save time and ensure consistency across your organization.
                </p>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <div className="bg-primary/10 text-primary p-3 rounded-lg inline-block mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 14V17M8 7V6C8 4.89543 8.89543 4 10 4H14C15.1046 4 16 4.89543 16 6V7M8 7H16M8 7H6C4.89543 7 4 7.89543 4 9V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V9C20 7.89543 19.1046 7 18 7H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Document Workflow</h3>
                <p className="text-foreground/70">
                  Create sequential signing orders to ensure documents are signed in the right order.
                  Track the progress of each document through its approval cycle.
                </p>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <div className="bg-primary/10 text-primary p-3 rounded-lg inline-block mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3V4M12 20V21M21 12H20M4 12H3M18.364 18.364L17.657 17.657M6.343 6.343L5.636 5.636M18.364 5.636L17.657 6.343M6.343 17.657L5.636 18.364M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Audit Trails</h3>
                <p className="text-foreground/70">
                  Every action is tracked and timestamped, creating a detailed audit trail.
                  See who viewed, signed, or modified a document, and when these actions occurred.
                </p>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <div className="bg-primary/10 text-primary p-3 rounded-lg inline-block mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Team Management</h3>
                <p className="text-foreground/70">
                  Create teams and manage document access permissions.
                  Collaborate securely with internal and external stakeholders.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
