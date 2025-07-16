import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Mail, X, Send } from 'lucide-react';
import { toast } from '@/utils/toast';

interface Recipient {
  id: string;
  name: string;
  email: string;
  role: 'signer' | 'viewer';
}

interface RecipientManagerProps {
  recipients: Recipient[];
  onRecipientsChange: (recipients: Recipient[]) => void;
  onSendSigningRequests?: () => void;
  className?: string;
}

const RecipientManager: React.FC<RecipientManagerProps> = ({
  recipients,
  onRecipientsChange,
  onSendSigningRequests,
  className = ''
}) => {
  const [newRecipient, setNewRecipient] = useState({ name: '', email: '' });

  const addRecipient = () => {
    if (!newRecipient.name.trim() || !newRecipient.email.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both name and email address.",
        variant: "destructive"
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newRecipient.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicates
    if (recipients.some(r => r.email === newRecipient.email)) {
      toast({
        title: "Duplicate email",
        description: "This email address is already added.",
        variant: "destructive"
      });
      return;
    }

    const recipient: Recipient = {
      id: Date.now().toString(),
      name: newRecipient.name.trim(),
      email: newRecipient.email.trim().toLowerCase(),
      role: 'signer'
    };

    onRecipientsChange([...recipients, recipient]);
    setNewRecipient({ name: '', email: '' });
    
    toast({
      title: "Recipient added",
      description: `${recipient.name} has been added to the signing list.`
    });
  };

  const removeRecipient = (id: string) => {
    onRecipientsChange(recipients.filter(r => r.id !== id));
    toast({
      title: "Recipient removed",
      description: "Recipient has been removed from the signing list."
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRecipient();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Document Recipients
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add new recipient form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input
              placeholder="Recipient name"
              value={newRecipient.name}
              onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
              onKeyPress={handleKeyPress}
            />
            <Input
              placeholder="email@example.com"
              type="email"
              value={newRecipient.email}
              onChange={(e) => setNewRecipient(prev => ({ ...prev, email: e.target.value }))}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={addRecipient} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Recipients list */}
          <div className="space-y-2">
            {recipients.map((recipient) => (
              <div key={recipient.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{recipient.name}</p>
                  <p className="text-sm text-muted-foreground">{recipient.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRecipient(recipient.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {recipients.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recipients added yet</p>
              <p className="text-sm">Add recipients who need to sign this document</p>
            </div>
          )}

          {/* Send signing requests button */}
          {recipients.length > 0 && onSendSigningRequests && (
            <div className="pt-4 border-t">
              <Button onClick={onSendSigningRequests} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Signing Requests ({recipients.length} {recipients.length === 1 ? 'recipient' : 'recipients'})
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipientManager;