
import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useChat } from "@/contexts/ChatContext";
import { toast } from "@/hooks/use-toast";

// Mock protocols
const PROTOCOLS = [
  { id: "2025-000123", title: "Solicitação de material escolar" },
  { id: "2025-000124", title: "Consulta de agendamento médico" },
  { id: "2025-000125", title: "Análise de projeto urbano" },
  { id: "2025-000126", title: "Manutenção de calçada" },
  { id: "2025-000127", title: "Iluminação pública" }
];

interface LinkProtocolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
}

export function LinkProtocolDialog({
  open,
  onOpenChange,
  conversationId,
}: LinkProtocolDialogProps) {
  const { conversations, addProtocolToConversation } = useChat();
  const [selectedProtocolId, setSelectedProtocolId] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Get current conversation
  const conversation = conversations.find(conv => conv.id === conversationId);
  
  // Filter out protocols that are already linked to this conversation
  const availableProtocols = PROTOCOLS.filter(protocol => 
    !conversation?.protocolIds?.includes(protocol.id)
  );

  const handleSubmit = async () => {
    if (!selectedProtocolId) {
      toast({
        title: "Erro",
        description: "Selecione um protocolo para vincular.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      await addProtocolToConversation(conversationId, selectedProtocolId);
      
      // Reset and close
      setSelectedProtocolId("");
      onOpenChange(false);
      
      toast({
        title: "Protocolo vinculado",
        description: "O protocolo foi vinculado à conversa com sucesso.",
      });
    } catch (error) {
      console.error("Error linking protocol:", error);
      toast({
        title: "Erro",
        description: "Não foi possível vincular o protocolo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Vincular protocolo à conversa</DrawerTitle>
            <DrawerDescription>
              Selecione um protocolo para vincular a esta conversa.
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="p-4">
            <Select
              value={selectedProtocolId}
              onValueChange={setSelectedProtocolId}
            >
              <SelectTrigger className="mb-4">
                <SelectValue placeholder="Selecione um protocolo" />
              </SelectTrigger>
              <SelectContent>
                {availableProtocols.length > 0 ? (
                  availableProtocols.map(protocol => (
                    <SelectItem key={protocol.id} value={protocol.id}>
                      {protocol.id} - {protocol.title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Todos os protocolos já estão vinculados
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            
            {conversation?.protocolIds && conversation.protocolIds.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Protocolos vinculados:</h4>
                <ul className="text-sm space-y-1">
                  {conversation.protocolIds.map(id => {
                    const protocol = PROTOCOLS.find(p => p.id === id);
                    return (
                      <li key={id} className="text-muted-foreground">
                        {id} {protocol ? `- ${protocol.title}` : ""}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          
          <DrawerFooter className="pt-2">
            <Button onClick={handleSubmit} disabled={!selectedProtocolId || loading}>
              {loading ? "Vinculando..." : "Vincular protocolo"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
