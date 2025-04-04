
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from '@/context/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { SavedDocument } from '@/hooks/useTemplateEditor';
import { 
  FileText, 
  Edit, 
  Trash, 
  Share2, 
  Download, 
  Clock, 
  Plus,
  Loader2
} from 'lucide-react';
import { toast } from '@/utils/toast';
import { formatDistanceToNow } from 'date-fns';

const MyDocuments = () => {
  const navigate = useNavigate();
  const { session } = useSession();
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!session?.user) {
      navigate('/auth', { state: { returnTo: '/my-documents' } });
      return;
    }

    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) {
          throw error;
        }

        setDocuments(data || []);
      } catch (error: any) {
        console.error('Error fetching documents:', error);
        toast({
          title: "Error",
          description: "Could not load your documents.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [session, navigate]);

  const handleEdit = (id: string) => {
    // For templates, we'd navigate to template editor
    // For regular documents, we'd navigate to document editor
    navigate(`/document-editor/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update documents state to remove the deleted document
      setDocuments(documents.filter(doc => doc.id !== id));
      
      toast({
        title: "Document deleted",
        description: "Document has been deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast({
        title: "Delete failed",
        description: "Could not delete document.",
        variant: "destructive"
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleShare = async (document: SavedDocument) => {
    try {
      // Mark document as public if not already
      if (!document.is_public) {
        const { error } = await supabase
          .from('documents')
          .update({ is_public: true })
          .eq('id', document.id);
          
        if (error) throw error;
      }
      
      // Generate and copy share URL
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/view-document/${document.id}`;
      
      navigator.clipboard.writeText(shareUrl).then(
        () => {
          toast({
            title: "Link copied",
            description: "Share link has been copied to clipboard.",
          });
        },
        (err) => {
          console.error('Could not copy text: ', err);
          toast({
            title: "Share link created",
            description: `Share this link: ${shareUrl}`,
          });
        }
      );
    } catch (error: any) {
      console.error('Error sharing document:', error);
      toast({
        title: "Share failed",
        description: "Could not share document.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = (document: SavedDocument) => {
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

  const handleCreateNew = () => {
    navigate('/templates');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-10 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Documents</h1>
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Document
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : documents.length === 0 ? (
            <Card className="text-center p-12">
              <div className="mb-4">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No documents yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't created any documents yet. Start by creating a new document from a template.
              </p>
              <Button onClick={handleCreateNew}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Document
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map(document => (
                <Card key={document.id} className="overflow-hidden flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="truncate">{document.title}</CardTitle>
                    <CardDescription className="flex items-center text-xs">
                      <Clock className="h-3 w-3 mr-1 inline" />
                      Updated {formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="h-24 overflow-hidden text-sm text-muted-foreground">
                      <div dangerouslySetInnerHTML={{ 
                        __html: document.content.length > 200 
                          ? document.content.substring(0, 200) + '...' 
                          : document.content 
                      }} />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between bg-muted/20 pt-3">
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => handleEdit(document.id)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => handleShare(document)}
                      >
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Share</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => handleDownload(document)}
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive/90" 
                      onClick={() => handleDelete(document.id)}
                      disabled={deleting === document.id}
                    >
                      {deleting === document.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash className="h-4 w-4" />
                      )}
                      <span className="sr-only">Delete</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyDocuments;
