
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Download } from 'lucide-react';

const ViewDocument = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<{ title: string, content: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('documents')
          .select('title, content')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setDocument(data as { title: string, content: string });
        }
      } catch (error: any) {
        console.error('Error fetching document:', error);
        setError('This document does not exist or is not available for viewing.');
        toast({
          title: "Error",
          description: "Could not load document.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDocument();
    }
  }, [id]);

  const handleDownload = () => {
    if (!document) return;
    
    // Create a blob with the content
    const blob = new Blob([document.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and click it
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.title}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Document downloaded",
      description: "Document has been downloaded successfully.",
    });
  };

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
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <Card className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Document Not Available</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={handleBack}>Return to Home</Button>
            </Card>
          ) : document ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{document.title}</h1>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              
              <Card className="p-6">
                <div 
                  className="prose max-w-none dark:prose-invert" 
                  dangerouslySetInnerHTML={{ __html: document.content }}
                />
              </Card>
            </>
          ) : (
            <Card className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Document Not Found</h2>
              <Button onClick={handleBack}>Return to Home</Button>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ViewDocument;
