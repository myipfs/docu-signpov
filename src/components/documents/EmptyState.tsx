
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateNew: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNew }) => {
  return (
    <Card className="text-center p-12">
      <div className="mb-4">
        <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">No documents yet</h2>
      <p className="text-muted-foreground mb-6">
        You haven't created any documents yet. Start by creating a new document from a template.
      </p>
      <Button onClick={onCreateNew}>
        <Plus className="mr-2 h-4 w-4" />
        Create Your First Document
      </Button>
    </Card>
  );
};
