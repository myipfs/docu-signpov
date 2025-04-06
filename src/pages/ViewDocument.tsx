
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DocumentViewer } from '@/components/documents/DocumentViewer';
import { DocumentError } from '@/components/documents/DocumentError';
import { DocumentNotFound } from '@/components/documents/DocumentNotFound';
import { DocumentLoading } from '@/components/documents/DocumentLoading';
import { useViewDocument } from '@/hooks/useViewDocument';

const ViewDocument = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { document, loading, error, handleDownload } = useViewDocument(id);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6 px-4">
        <div className="container mx-auto max-w-5xl">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          {loading ? (
            <DocumentLoading />
          ) : error ? (
            <DocumentError errorMessage={error} onBack={handleBack} />
          ) : document ? (
            <DocumentViewer document={document} onDownload={handleDownload} />
          ) : (
            <DocumentNotFound onBack={handleBack} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ViewDocument;
