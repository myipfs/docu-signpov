import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/utils/toast';
import { Trash2, Pencil, Move, Check } from 'lucide-react';
import { SignaturePad } from './SignaturePad';
import { supabase } from '@/integrations/supabase/client';
import { useEncryption } from '@/hooks/useEncryption';

interface SignatureFieldProps {
  id: string;
  name: string;
  recipientId: string;
  recipientName: string;
  position: { x: number; y: number; page: number };
  isSigned: boolean;
  onSign?: () => void;
  onDelete?: () => void;
  onMove?: (position: { x: number; y: number; page: number }) => void;
  readOnly?: boolean;
}

export function SignatureField({
  id,
  name,
  recipientId,
  recipientName,
  position,
  isSigned,
  onSign,
  onDelete,
  onMove,
  readOnly = false
}: SignatureFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [isSignaturePadOpen, setIsSignaturePadOpen] = useState(false);
  const { isAuthenticated, encryptData } = useEncryption();

  useEffect(() => {
  }, []);

  const handleSign = () => {
    if (readOnly) return;
    setIsSignaturePadOpen(true);
  };

  const handleSaveSignature = async (signatureDataUrl: string) => {
    try {
      if (isAuthenticated) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          const encryptedSignature = await encryptData(signatureDataUrl);
          setSignature(signatureDataUrl);
          if (onSign) {
            onSign();
          }
        }
      } else {
        setSignature(signatureDataUrl);
        if (onSign) {
          onSign();
        }
      }
      
      toast.success('Signature added successfully!');
    } catch (error) {
      console.error('Error processing signature:', error);
      toast.error('Failed to process signature');
    }
  };

  const handleDelete = () => {
    if (!onDelete) return;
    
    onDelete();
    toast.success('Signature field removed');
  };

  const handleMoveStart = () => {
    if (readOnly || !onMove) return;
    
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMoveEnd);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !onMove) return;
    
    const x = e.clientX;
    const y = e.clientY;
    
    const element = document.getElementById(`signature-field-${id}`);
    if (element) {
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
    }
  };

  const handleMoveEnd = (e: MouseEvent) => {
    if (!isDragging || !onMove) return;
    
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMoveEnd);
    
    const x = e.clientX;
    const y = e.clientY;
    
    onMove({ x, y, page: position.page });
  };

  return (
    <>
      <div
        id={`signature-field-${id}`}
        className={`absolute border-2 rounded-md p-2 w-64 backdrop-blur-sm
          ${isDragging ? 'cursor-grabbing z-50' : ''}
          ${isSigned ? 'border-green-500 bg-green-50/30' : 'border-dashed border-primary/70 bg-background/80'}
          ${readOnly ? 'pointer-events-none' : ''}
        `}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transition: isDragging ? 'none' : 'all 0.2s ease'
        }}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground/70">
              {name} {recipientName ? `(${recipientName})` : ''}
            </p>
            {!readOnly && (
              <div className="flex gap-1">
                {!isSigned && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon" 
                      className="h-6 w-6 cursor-grab"
                      onMouseDown={handleMoveStart}
                    >
                      <Move className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
          
          {isSigned ? (
            <div className="py-2 px-4 bg-white rounded border">
              {signature ? (
                <img src={signature} alt="Signature" className="max-h-16" />
              ) : (
                <div className="font-signature text-lg">{recipientName}</div>
              )}
              <div className="flex items-center text-xs text-green-600 mt-1">
                <Check className="h-3 w-3 mr-1" />
                Signed
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="h-16 border-dashed border-primary/50 justify-start font-normal text-muted-foreground hover:text-primary"
              onClick={handleSign}
              disabled={readOnly}
            >
              Click to sign here
            </Button>
          )}
        </div>
      </div>

      <SignaturePad
        open={isSignaturePadOpen}
        onClose={() => setIsSignaturePadOpen(false)}
        onSave={handleSaveSignature}
        initialName={recipientName}
      />
    </>
  );
}
