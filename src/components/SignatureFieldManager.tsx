
import React, { useState } from 'react';
import RecipientManager from './signature/RecipientManager';
import { DocumentArea } from './signature/DocumentArea';
import { Recipient, SignatureFieldData } from '@/types/signature';

interface SignatureFieldManagerProps {
  documentId: string;
  recipients: Recipient[];
  fields: SignatureFieldData[];
  onAddField: (field: Omit<SignatureFieldData, 'id'>) => void;
  onUpdateField: (id: string, data: Partial<SignatureFieldData>) => void;
  onDeleteField: (id: string) => void;
  onAddRecipient: (recipient: Omit<Recipient, 'id'>) => void;
  readOnly?: boolean;
}

export function SignatureFieldManager({
  documentId,
  recipients, 
  fields,
  onAddField,
  onUpdateField,
  onDeleteField,
  onAddRecipient,
  readOnly = false
}: SignatureFieldManagerProps) {
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(
    recipients.length > 0 ? recipients[0].id : null
  );

  return (
    <div className="flex flex-col h-full">
      {!readOnly && (
        <div className="bg-card border-b p-4">
          <RecipientManager
            recipients={recipients}
            onRecipientsChange={(newRecipients) => {
              // Convert to the expected format
              newRecipients.forEach(recipient => {
                if (!recipients.find(r => r.id === recipient.id)) {
                  const { id, ...recipientWithoutId } = recipient;
                  onAddRecipient(recipientWithoutId);
                }
              });
            }}
          />
        </div>
      )}
      
      <DocumentArea
        fields={fields}
        recipients={recipients}
        onAddField={onAddField}
        onUpdateField={onUpdateField}
        onDeleteField={onDeleteField}
        selectedRecipientId={selectedRecipientId}
        readOnly={readOnly}
      />
    </div>
  );
}
