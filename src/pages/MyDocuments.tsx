
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useSession } from '@/context/SessionContext';
import { Plus } from 'lucide-react';
import { DocumentList } from '@/components/documents/DocumentList';
import { useDocumentList } from '@/hooks/useDocumentList';

const MyDocuments = () => {
  const navigate = useNavigate();
  const { session } = useSession();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!session?.user) {
      navigate('/auth', { state: { returnTo: '/my-documents' } });
    }
  }, [session, navigate]);

  const {
    documents,
    loading,
    deleting,
    handleEdit,
    handleDelete,
    handleShare,
    handleDownload,
    handleCreateNew
  } = useDocumentList(session?.user?.id);

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

          <DocumentList
            documents={documents}
            loading={loading}
            deleting={deleting}
            onEdit={handleEdit}
            onShare={handleShare}
            onDownload={handleDownload}
            onDelete={handleDelete}
            onCreateNew={handleCreateNew}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyDocuments;
