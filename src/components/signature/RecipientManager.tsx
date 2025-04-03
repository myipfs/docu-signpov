import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { toast } from '@/utils/toast';
import { UserPlus } from 'lucide-react';
import { Recipient } from '@/types/signature';

interface RecipientManagerProps {
  recipients: Recipient[];
  onAddRecipient: (recipient: Omit<Recipient, 'id'>) => void;
  selectedRecipientId: string | null;
  setSelectedRecipientId: (id: string) => void;
}

export function RecipientManager({ 
  recipients, 
  onAddRecipient, 
  selectedRecipientId,
  setSelectedRecipientId
}: RecipientManagerProps) {
  const [isAddingRecipient, setIsAddingRecipient] = useState(false);
  const [newRecipient, setNewRecipient] = useState<Omit<Recipient, 'id'>>({ 
    name: '', 
    email: '', 
    role: 'signer' 
  });

  const handleAddRecipient = () => {
    if (!newRecipient.name || !newRecipient.email) {
      toast.error('Name and email are required');
      return;
    }
    
    onAddRecipient(newRecipient);
    setNewRecipient({ name: '', email: '', role: 'signer' });
    setIsAddingRecipient(false);
    toast.success('Recipient added successfully');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Add signature fields</h3>
        <Popover open={isAddingRecipient} onOpenChange={setIsAddingRecipient}>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline" className="gap-2">
              <UserPlus size={16} />
              Add Recipient
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <h4 className="font-medium">Add a new recipient</h4>
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm">
                  Name
                </label>
                <Input
                  id="name"
                  value={newRecipient.name}
                  onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={newRecipient.email}
                  onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="role" className="text-sm">
                  Role
                </label>
                <select
                  id="role"
                  value={newRecipient.role}
                  onChange={(e) => setNewRecipient({ 
                    ...newRecipient, 
                    role: e.target.value as 'signer' | 'viewer'
                  })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="signer">Signer</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <Button onClick={handleAddRecipient}>Add Recipient</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex gap-2 overflow-x-auto py-2 mb-2">
        {recipients.map((recipient) => (
          <Button
            key={recipient.id}
            variant={selectedRecipientId === recipient.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRecipientId(recipient.id)}
          >
            {recipient.name}
          </Button>
        ))}
      </div>

      {recipients.length > 0 && selectedRecipientId && (
        <div className="text-sm text-muted-foreground">
          Click on the document to add a signature field for{' '}
          <span className="font-medium text-foreground">
            {recipients.find(r => r.id === selectedRecipientId)?.name}
          </span>
        </div>
      )}
      
      {recipients.length === 0 && (
        <div className="text-sm text-muted-foreground">
          Add a recipient first to place signature fields
        </div>
      )}
    </div>
  );
}
