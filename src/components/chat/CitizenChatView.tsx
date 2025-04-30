import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, X, Plus } from "lucide-react";
import { useChat, ChatConversation } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";
import { ConversationView } from "./ConversationView";
import { EmptyState } from "./EmptyState";
import { ConversationList } from "./ConversationList";

export function CitizenChatView() {
  const { 
    conversations,
    activeConversationId,
    messages,
    setActiveConversation,
    sendMessage
  } = useChat();
  const [message, setMessage] = useState("");

  // Filter to only show citizen conversations
  const citizenConversations = conversations.filter(
    (conv) => conv.type === "citizen"
  );

  const handleSendMessage = () => {
    if (!message.trim() || !activeConversationId) return;
    sendMessage(activeConversationId, message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderChatContent = () => {
    // If an active conversation is selected, show its messages
    if (activeConversationId && messages[activeConversationId]) {
      return <ConversationView />;
    } 
    
    // Otherwise, show the list of conversations
    return (
      <>
        <div className="p-4 border-b">
          <h3 className="font-semibold">Minhas Conversas</h3>
          <p className="text-sm text-muted-foreground">
            Selecione uma conversa para começar
          </p>
        </div>
        
        {citizenConversations.length === 0 ? (
          <EmptyState 
            title="Nenhuma conversa ativa"
            description="Você ainda não tem conversas ativas. Para iniciar uma conversa, você precisa ter um protocolo aberto."
          />
        ) : (
          <ScrollArea className="flex-1 p-3">
            <ConversationList 
              conversations={citizenConversations} 
              onSelect={setActiveConversation}
            />
          </ScrollArea>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Chat digiurban</h3>
        {activeConversationId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveConversation(null)}
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderChatContent()}
      </div>
    </div>
  );
}
