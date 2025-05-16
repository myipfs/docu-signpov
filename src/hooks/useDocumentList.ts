import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SavedDocument } from '@/types/document';
import { toast } from '@/utils/toast';

// Make sure the document editing route is properly handled
// Add route check to the top of the file to ensure consistent behavior
const DOCUMENT_EDIT_ROUTE = '/document-editor';

export const useDocumentList = (userId?: string) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', userId) // Make sure we're explicitly filtering by the current user
          .order('updated_at', { ascending: false });

        if (error) {
          throw error;
        }

        setDocuments(data as SavedDocument[] || []);
      } catch (error: any) {
        console.error('Error fetching documents:', error);
        toast({
          title: "Error",
          description: "Could not load your documents. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [userId]);

  // Inside the handleEdit function, update the navigation path:
  const handleEdit = (id: string) => {
    navigate(`${DOCUMENT_EDIT_ROUTE}/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      
      // First check if the document exists and belongs to the current user
      const { data: existingDoc, error: fetchError } = await supabase
        .from('documents')
        .select('id')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (fetchError || !existingDoc) {
        throw new Error('Document not found or you do not have permission to delete it');
      }

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
        description: error.message || "Could not delete document. Please try again.",
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
          .eq('id', document.id)
          .eq('user_id', userId); // Make sure we're only updating documents owned by this user
          
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
        description: "Could not share document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = (doc: SavedDocument) => {
    // Create a blob with the content
    const blob = new Blob([doc.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and click it
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${doc.title}.txt`;
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

  const handleCreateNew = () => {
    navigate('/templates');
  };

  return {
    documents,
    loading,
    deleting,
    handleEdit,
    handleDelete,
    handleShare,
    handleDownload,
    handleCreateNew
  };
};
