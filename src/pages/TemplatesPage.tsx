
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Templates from '@/components/Templates';
import { useSearchParams } from 'react-router-dom';

const TemplatesPage = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || 'all';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-4">Document Templates</h1>
            <p className="text-foreground/70 max-w-3xl">
              Browse our collection of professional document templates. Customize and use these templates for your business needs, legal agreements, contracts, and more.
            </p>
          </div>
          
          <Templates initialCategory={categoryFilter} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TemplatesPage;
