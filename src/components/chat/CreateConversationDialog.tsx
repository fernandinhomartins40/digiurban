
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useChat } from '@/contexts/ChatContext';

interface CreateConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateConversationDialog({ 
  open, 
  onOpenChange 
}: CreateConversationDialogProps) {
  const { contacts, createConversation, setActiveConversation } = useChat();
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [conversationTitle, setConversationTitle] = useState<string>('');

  const handleCreateConversation = async () => {
    if (selectedContact) {
      // Find selected contact
      const contact = contacts.find(c => c.id === selectedContact);
      
      if (contact) {
        try {
          // Internal conversations for admins
          const conversationId = await createConversation(
            'internal',
            contact.id,
            conversationTitle || `Conversa com ${contact.name}`
          );
          
          setActiveConversation(conversationId);
          onOpenChange(false);
          
          // Reset form
          setSelectedContact('');
          setConversationTitle('');
        } catch (error) {
          console.error("Error creating conversation:", error);
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova conversa</DialogTitle>
          <DialogDescription>
            Crie uma nova conversa com outro departamento ou servidor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="contact">Selecione um contato</Label>
            <select 
              id="contact"
              value={selectedContact}
              onChange={(e) => setSelectedContact(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Selecione...</option>
              {contacts
                .filter(c => c.type !== 'citizen')
                .map(contact => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name} {contact.departmentName ? `(${contact.departmentName})` : ''}
                  </option>
                ))
              }
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título da conversa (opcional)</Label>
            <Input
              id="title"
              placeholder="Ex: Planejamento de evento"
              value={conversationTitle}
              onChange={(e) => setConversationTitle(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreateConversation}
            disabled={!selectedContact}
          >
            Criar conversa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
