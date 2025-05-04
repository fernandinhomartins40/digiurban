
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
import { toast } from '@/hooks/use-toast';

// Mock protocols
const MOCK_PROTOCOLS = [
  { id: '2025-000123', title: 'Solicitação de material escolar' },
  { id: '2025-000124', title: 'Consulta de agendamento médico' },
  { id: '2025-000125', title: 'Análise de projeto urbano' },
  { id: '2025-000126', title: 'Manutenção de calçada' },
  { id: '2025-000127', title: 'Iluminação pública' },
];

interface LinkProtocolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
}

export function LinkProtocolDialog({ 
  open, 
  onOpenChange, 
  conversationId
}: LinkProtocolDialogProps) {
  const { addProtocolToConversation } = useChat();
  const [protocolId, setProtocolId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const filteredProtocols = MOCK_PROTOCOLS.filter(protocol => 
    protocol.id.includes(searchQuery) || 
    protocol.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLinkProtocol = async () => {
    if (protocolId) {
      try {
        await addProtocolToConversation(conversationId, protocolId);
        toast({
          description: `Protocolo ${protocolId} vinculado com sucesso.`,
        });
        onOpenChange(false);
        setProtocolId('');
        setSearchQuery('');
      } catch (error) {
        console.error("Error linking protocol:", error);
        toast({
          variant: "destructive",
          description: "Erro ao vincular protocolo. Tente novamente.",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vincular protocolo</DialogTitle>
          <DialogDescription>
            Vincule esta conversa a um protocolo existente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar protocolo</Label>
            <Input
              id="search"
              placeholder="Digite o número ou nome do protocolo"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="border rounded-md max-h-60 overflow-y-auto">
            {filteredProtocols.length > 0 ? (
              <div className="divide-y">
                {filteredProtocols.map(protocol => (
                  <div 
                    key={protocol.id}
                    className={`p-3 cursor-pointer hover:bg-muted ${
                      protocol.id === protocolId ? 'bg-primary/10' : ''
                    }`}
                    onClick={() => setProtocolId(protocol.id)}
                  >
                    <div className="font-medium">{protocol.id}</div>
                    <div className="text-sm text-muted-foreground">{protocol.title}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Nenhum protocolo encontrado
              </div>
            )}
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
            onClick={handleLinkProtocol}
            disabled={!protocolId}
          >
            Vincular protocolo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
