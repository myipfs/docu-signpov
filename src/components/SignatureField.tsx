
import React, { useState, useEffect } from 'react';
import { toast } from '@/utils/toast';
import { SignaturePad } from './SignaturePad';
import { supabase } from '@/integrations/supabase/client';
import { useEncryption } from '@/hooks/useEncryption';
import { useDraggable } from '@/hooks/useDraggable';
import { SignatureDisplay } from './signature/SignatureDisplay';
import { SignatureFieldControls } from './signature/SignatureFieldControls';
import { SignButton } from './signature/SignButton';

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
  const [signature, setSignature] = useState<string | null>(null);
  const [isSignaturePadOpen, setIsSignaturePadOpen] = useState(false);
  const { isAuthenticated, encryptData } = useEncryption();
  
  const { isDragging, handleMoveStart } = useDraggable({
    initialPosition: position,
    onPositionChange: onMove,
    elementId: `signature-field-${id}`,
    disabled: readOnly || !onMove
  });
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("User is not authenticated");
      }
    };
    
    checkAuth();
  }, []);

  const handleSign = () => {
    if (readOnly) return;
    setIsSignaturePadOpen(true);
  };

  const handleSaveSignature = async (signatureDataUrl: string) => {
    try {
      setIsSignaturePadOpen(false);
      
      if (isAuthenticated) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          try {
            const encryptedSignature = await encryptData(signatureDataUrl);
            setSignature(signatureDataUrl);
            if (onSign) {
              onSign();
            }
          } catch (encryptError) {
            console.error('Encryption error:', encryptError);
            toast.error('Failed to process signature');
            return;
          }
        } else {
          toast.error('You must be logged in to sign documents');
          return;
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
            
            <SignatureFieldControls 
              isVisible={!readOnly && !isSigned}
              onEdit={() => setIsEditing(!isEditing)}
              onMoveStart={handleMoveStart}
              onDelete={handleDelete}
            />
          </div>
          
          <SignatureDisplay 
            signature={signature}
            recipientName={recipientName}
            isSigned={isSigned}
          />
          
          {!isSigned && (
            <SignButton onClick={handleSign} disabled={readOnly} />
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
