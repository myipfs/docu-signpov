
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTemplateEditor } from '@/hooks/useTemplateEditor';
import { templates } from '@/data/templateData';
import TemplateEditorHeader from '@/components/template-editor/TemplateEditorHeader';
import TemplateEditorContent from '@/components/template-editor/TemplateEditorContent';

const TemplateEditor = () => {
  const { id } = useParams<{ id: string }>();
  
  const {
    documentTitle,
    setDocumentTitle,
    content,
    setContent,
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
  } = useTemplateEditor(id, templates);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6 px-4">
        <div className="container mx-auto max-w-7xl">
          <TemplateEditorHeader 
            documentTitle={documentTitle}
            setDocumentTitle={setDocumentTitle}
            isAuthenticated={isAuthenticated}
            handleSave={handleSave}
            handleShare={handleShare}
            handleDownload={handleDownload}
            handleLoginRedirect={handleLoginRedirect}
            isSaving={isSaving}
            isSharing={isSharing}
            documentId={documentId}
            shareUrl={shareUrl}
          />
          
          <TemplateEditorContent
            content={content}
            setContent={setContent}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TemplateEditor;
