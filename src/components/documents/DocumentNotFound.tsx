
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DocumentNotFoundProps {
  onBack: () => void;
}

export const DocumentNotFound: React.FC<DocumentNotFoundProps> = ({ onBack }) => {
  return (
    <Card className="p-6 text-center">
      <h2 className="text-xl font-semibold mb-4">Document Not Found</h2>
      <Button onClick={onBack}>Return to Home</Button>
    </Card>
  );
};
