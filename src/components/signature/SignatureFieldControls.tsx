
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Pencil, Move } from 'lucide-react';

interface SignatureFieldControlsProps {
  isVisible: boolean;
  onEdit: () => void;
  onMoveStart: (e: React.MouseEvent) => void;
  onDelete: () => void;
}

export function SignatureFieldControls({
  isVisible,
  onEdit,
  onMoveStart,
  onDelete
}: SignatureFieldControlsProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={onEdit}
      >
        <Pencil className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon" 
        className="h-6 w-6 cursor-grab"
        onMouseDown={onMoveStart}
      >
        <Move className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={onDelete}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
