
import React from 'react';
import { SavedDocument } from '@/types/document';
import { DocumentCard } from './DocumentCard';
import { EmptyState } from './EmptyState';

interface DocumentListProps {
  documents: SavedDocument[];
  loading: boolean;
  deleting: string | null;
  onEdit: (id: string) => void;
  onShare: (document: SavedDocument) => void;
  onDownload: (document: SavedDocument) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  loading,
  deleting,
  onEdit,
  onShare,
  onDownload,
  onDelete,
  onCreateNew
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return <EmptyState onCreateNew={onCreateNew} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map(document => (
        <DocumentCard
          key={document.id}
          document={document}
          onEdit={onEdit}
          onShare={onShare}
          onDownload={onDownload}
          onDelete={onDelete}
          isDeleting={deleting === document.id}
        />
      ))}
    </div>
  );
};
