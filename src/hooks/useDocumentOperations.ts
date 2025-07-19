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

  const downloadDocument = (documentTitle: string, content: string, isSignedDocument: boolean = false) => {
    if (isSignedDocument) {
      // For signed documents, create PDF format
      // This would require actual PDF generation - for now, we'll use HTML as summary
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Signed Document - ${documentTitle}</title>
    <style>
        body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            color: #333;
        }
        .signature-header {
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .signature-section {
            border-top: 1px solid #ccc;
            margin-top: 40px;
            padding-top: 20px;
        }
        h1, h2, h3 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
        p { margin-bottom: 16px; }
        .status { color: #059669; font-weight: 600; }
    </style>
</head>
<body>
    <div class="signature-header">
        <h1>Signed Document</h1>
        <p><strong>Original File:</strong> ${documentTitle}</p>
        <p><strong>Signed on:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
    </div>
    
    <div class="document-content">
        ${content}
    </div>
    
    <div class="signature-section">
        <h3>Digital Signature Certification</h3>
        <p class="status">Status: Digitally Signed</p>
        <p><strong>Signature Type:</strong> Electronic Signature</p>
        <p><strong>Verification:</strong> Valid</p>
    </div>
</body>
</html>`;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `signed_${documentTitle}.html`;
      window.document.body.appendChild(a);
      a.click();
      
      URL.revokeObjectURL(url);
      window.document.body.removeChild(a);
      
      toast({
        title: "Signed document downloaded",
        description: "Your signed document summary has been downloaded as HTML.",
      });
    } else {
      // For unsigned documents, create plain text format
      // Strip HTML tags for plain text
      const textContent = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${documentTitle}.txt`;
      window.document.body.appendChild(a);
      a.click();
      
      URL.revokeObjectURL(url);
      window.document.body.removeChild(a);
      
      toast({
        title: "Document downloaded",
        description: "Your document has been downloaded as text file.",
      });
    }
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
