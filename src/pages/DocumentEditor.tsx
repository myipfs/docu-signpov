
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, FileText, Download, Share2, Loader2 } from 'lucide-react';
import TextEditor from '@/components/TextEditor';
import { toast } from '@/utils/toast';
import { useSession } from '@/context/SessionContext';
import { useDocumentOperations } from '@/hooks/useDocumentOperations';
import { supabase } from '@/integrations/supabase/client';

const DocumentEditor = () => {
  const { id } = useParams<{ id?: string }>();
  const { session } = useSession();
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState('edit');
  const [isLoading, setIsLoading] = useState(id ? true : false);
  
  const {
    saveDocument,
    shareDocument,
    downloadDocument,
    isSaving,
    isSharing,
    documentId,
    setDocumentId,
    shareUrl
  } = useDocumentOperations();

  // Load document if ID is provided
  useEffect(() => {
    if (id) {
      setDocumentId(id);
      
      const fetchDocument = async () => {
        try {
          setIsLoading(true);
          const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            throw error;
          }

          if (data) {
            setDocumentTitle(data.title);
            setContent(data.content);
          }
        } catch (error: any) {
          console.error('Error loading document:', error);
          toast({
            title: 'Error',
            description: 'Could not load the document. Please try again.',
            variant: 'destructive'
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchDocument();
    }
  }, [id]);

  const handleSave = async () => {
    if (!session?.user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to save documents.',
        variant: 'destructive'
      });
      return;
    }

    await saveDocument({
      documentId: id || documentId,
      documentTitle,
      content,
      userId: session.user.id
    });
  };

  const handleShare = async () => {
    if (!session?.user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to share documents.',
        variant: 'destructive'
      });
      return;
    }

    await shareDocument({
      documentId: id || documentId,
      documentTitle,
      content,
      userId: session.user.id
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading document...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <FileText className="text-primary" />
              <Input
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="text-xl font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                placeholder="Document Title"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare} disabled={isSharing}>
                {isSharing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadDocument(documentTitle, content)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <Card className="p-0 min-h-[calc(100vh-250px)]">
            <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
              <div className="border-b px-4">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="edit" className="p-0 m-0">
                <TextEditor 
                  content={content} 
                  setContent={setContent} 
                />
              </TabsContent>
              
              <TabsContent value="preview" className="p-6 m-0">
                {content ? (
                  <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                  <div className="text-center text-muted-foreground py-20">
                    <p>No content to preview yet.</p>
                    <p className="text-sm">Start editing to see a preview here.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
          
          {shareUrl && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="text-sm font-medium mb-1">Share link:</p>
              <div className="flex items-center gap-2">
                <Input value={shareUrl} readOnly className="text-sm font-mono" />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    toast({
                      title: "Link copied",
                      description: "Share link has been copied to clipboard.",
                    });
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DocumentEditor;
