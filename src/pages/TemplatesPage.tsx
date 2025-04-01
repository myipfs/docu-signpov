
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Templates from '@/components/Templates';
import TemplatePageHeader from '@/components/templates-page/TemplatePageHeader';

const TemplatesPage = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || 'all';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <TemplatePageHeader categoryFilter={categoryFilter} />
          <Templates initialCategory={categoryFilter} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TemplatesPage;
