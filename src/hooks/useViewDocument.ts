
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/utils/toast';

export const useViewDocument = (id: string | undefined) => {
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
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.title}.txt`;
    window.document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    window.document.body.removeChild(a);
    
    toast({
      title: "Document downloaded",
      description: "Document has been downloaded successfully.",
    });
  };

  return {
    document,
    loading,
    error,
    handleDownload
  };
};
