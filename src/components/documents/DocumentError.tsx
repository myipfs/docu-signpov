
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DocumentErrorProps {
  errorMessage: string;
  onBack: () => void;
}

export const DocumentError: React.FC<DocumentErrorProps> = ({ errorMessage, onBack }) => {
  return (
    <Card className="p-6 text-center">
      <h2 className="text-xl font-semibold mb-4">Document Not Available</h2>
      <p className="text-muted-foreground mb-6">{errorMessage}</p>
      <Button onClick={onBack}>Return to Home</Button>
    </Card>
  );
};
