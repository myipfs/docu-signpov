
import React from 'react';
import { Button } from '@/components/ui/button';

interface SignButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function SignButton({ onClick, disabled = false }: SignButtonProps) {
  return (
    <Button
      variant="outline"
      className="h-16 border-dashed border-primary/50 justify-start font-normal text-muted-foreground hover:text-primary"
      onClick={onClick}
      disabled={disabled}
    >
      Click to sign here
    </Button>
  );
}
