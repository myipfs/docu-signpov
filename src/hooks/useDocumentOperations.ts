
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/utils/toast';
import { SavedDocument } from '@/types/document';

interface DocumentOperationParams {
  documentId: string | null;
  documentTitle: string;
  content: string;
  templateId?: string | undefined;
  userId?: string;
}

export const useDocumentOperations = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const saveDocument = async ({
    documentId: currentDocId,
    documentTitle,
    content,
    templateId,
    userId
  }: DocumentOperationParams) => {
    try {
      setIsSaving(true);
      
      // Check if we have a document ID (for update) or need to create a new document
      if (currentDocId) {
        // Update existing document
        const { error } = await supabase
          .from('documents')
          .update({
            title: documentTitle,
            content: content,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentDocId);
          
        if (error) throw error;
        
        toast({
          title: "Document updated",
          description: "Your document has been updated successfully.",
        });

        return { documentId: currentDocId };
      } else {
        // Create new document
        const { data, error } = await supabase
          .from('documents')
          .insert({
            title: documentTitle,
            content: content,
            user_id: userId,
            template_id: templateId || null
          })
          .select('id')
          .single();
          
        if (error) throw error;
        
        setDocumentId(data.id);
        
        toast({
          title: "Document saved",
          description: "Your document has been saved successfully.",
        });

        return { documentId: data.id };
      }
    } catch (error: any) {
      console.error('Error saving document:', error);
      toast({
        title: "Save failed",
        description: error.message || "Could not save your document. Please try again.",
        variant: "destructive"
      });
      return { documentId: currentDocId };
    } finally {
      setIsSaving(false);
    }
  };

  const shareDocument = async ({
    documentId: currentDocId,
    documentTitle,
    content,
    templateId,
    userId
  }: DocumentOperationParams) => {
    try {
      setIsSharing(true);
      
      let docId = currentDocId;
      
      // First save the document if it hasn't been saved yet
      if (!docId) {
        const result = await saveDocument({
          documentId: null,
          documentTitle,
          content,
          templateId,
          userId
        });
        docId = result.documentId;
      }
      
      if (!docId) {
        throw new Error("Failed to save document before sharing");
      }
      
      // Update the document to set is_public to true
      const { error } = await supabase
        .from('documents')
        .update({ is_public: true })
        .eq('id', docId);
        
      if (error) throw error;
      
      // Generate a share URL
      const baseUrl = window.location.origin;
      const newShareUrl = `${baseUrl}/view-document/${docId}`;
      setShareUrl(newShareUrl);
      setDocumentId(docId);
      
      // Copy to clipboard
      navigator.clipboard.writeText(newShareUrl).then(
        () => {
          toast({
            title: "Share link created",
            description: "A sharing link has been copied to your clipboard.",
          });
        },
        (err) => {
          console.error('Could not copy text: ', err);
          toast({
            title: "Share link created",
            description: `Share this link: ${newShareUrl}`,
          });
        }
      );

      return { shareUrl: newShareUrl, documentId: docId };
    } catch (error: any) {
      console.error('Error sharing document:', error);
      toast({
        title: "Share failed",
        description: error.message || "Could not share your document. Please try again.",
        variant: "destructive"
      });
      return { shareUrl: null, documentId: currentDocId };
    } finally {
      setIsSharing(false);
    }
  };

  const downloadDocument = (documentTitle: string, content: string) => {
    // Create a blob with the content
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and click it
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${documentTitle}.txt`;
    window.document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    window.document.body.removeChild(a);
    
    toast({
      title: "Document downloaded",
      description: "Your document has been downloaded successfully.",
    });
  };

  return {
    saveDocument,
    shareDocument,
    downloadDocument,
    isSaving,
    isSharing,
    documentId,
    shareUrl,
    setDocumentId,
    setShareUrl
  };
};
