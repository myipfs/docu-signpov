
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { Template } from '@/types/template';
import { SavedDocument } from '@/types/document';
import { useTemplateContent } from '@/hooks/useTemplateContent';
import { useDocumentOperations } from '@/hooks/useDocumentOperations';

export type { SavedDocument };

export const useTemplateEditor = (templateId: string | undefined, templates: Template[]) => {
  const navigate = useNavigate();
  const { session } = useSession();
  const isAuthenticated = !!session?.user;
  
  const {
    template,
    documentTitle,
    setDocumentTitle,
    content,
    setContent,
    originalContent,
    activeTab,
    setActiveTab
  } = useTemplateContent(templateId, templates);
  
  const {
    saveDocument,
    shareDocument,
    downloadDocument,
    isSaving,
    isSharing,
    documentId,
    shareUrl,
    setDocumentId,
    setShareUrl
  } = useDocumentOperations();

  const handleSave = async () => {
    if (!isAuthenticated) {
      handleLoginRedirect();
      return;
    }
    
    await saveDocument({
      documentId,
      documentTitle,
      content,
      templateId,
      userId: session?.user.id
    });
  };

  const handleShare = async () => {
    if (!isAuthenticated) {
      handleLoginRedirect();
      return;
    }
    
    await shareDocument({
      documentId,
      documentTitle,
      content,
      templateId,
      userId: session?.user.id
    });
  };

  const handleDownload = () => {
    downloadDocument(documentTitle, content);
  };

  const handleLoginRedirect = () => {
    // Save current state to localStorage or URL params if needed
    navigate('/auth', { state: { returnTo: window.location.pathname } });
  };

  return {
    template,
    documentTitle,
    setDocumentTitle,
    content,
    setContent,
    originalContent,
    activeTab,
    setActiveTab,
    isAuthenticated,
    handleSave,
    handleDownload,
    handleShare,
    handleLoginRedirect,
    isSaving,
    isSharing,
    documentId,
    shareUrl
  };
};
