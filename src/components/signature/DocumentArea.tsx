import React from 'react';
import { SignatureField } from '@/components/SignatureField';
import { toast } from '@/utils/toast';
import { Recipient, SignatureFieldData } from '@/types/signature';

interface DocumentAreaProps {
  fields: SignatureFieldData[];
  recipients: Recipient[];
  onAddField: (field: Omit<SignatureFieldData, 'id'>) => void;
  onUpdateField: (id: string, data: Partial<SignatureFieldData>) => void;
  onDeleteField: (id: string) => void;
  selectedRecipientId: string | null;
  readOnly: boolean;
}

export function DocumentArea({
  fields,
  recipients,
  onAddField,
  onUpdateField,
  onDeleteField,
  selectedRecipientId,
  readOnly
}: DocumentAreaProps) {
  const handleAddField = (page: number, event: React.MouseEvent) => {
    if (readOnly || !selectedRecipientId) return;
    
    // Get relative position on the document
    const documentContainer = document.getElementById('document-container');
    if (!documentContainer) return;
    
    const rect = documentContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    onAddField({
      name: 'Signature',
      recipientId: selectedRecipientId,
      position: { x, y, page },
      isSigned: false
    });
    
    toast.success('Signature field added');
  };

  return (
    <div 
      id="document-container" 
      className="relative flex-grow overflow-auto"
      onClick={(e) => handleAddField(1, e)}
    >
      {/* Document content would be rendered here */}
      <div className="min-h-[1000px] bg-white shadow-md mx-auto my-8 max-w-[800px]">
        {/* Document pages would be rendered here */}
      </div>
      
      {/* Render all signature fields */}
      {fields.map((field) => (
        <SignatureField
          key={field.id}
          id={field.id}
          name={field.name}
          recipientId={field.recipientId}
          recipientName={recipients.find(r => r.id === field.recipientId)?.name || ''}
          position={field.position}
          isSigned={field.isSigned}
          onSign={() => onUpdateField(field.id, { isSigned: true })}
          onDelete={() => onDeleteField(field.id)}
          onMove={(position) => onUpdateField(field.id, { position })}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}
