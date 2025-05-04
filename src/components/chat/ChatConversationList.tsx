
import React from "react";
import { useChat, ChatConversation } from "@/contexts/ChatContext";
import { MessageCircle, Archive, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ChatConversationListProps {
  contactId?: string;
  statusFilter: "all" | "active" | "closed";
  searchQuery: string;
  onSelectConversation: (conversationId: string) => void;
}

export function ChatConversationList({
  contactId,
  statusFilter,
  searchQuery,
  onSelectConversation
}: ChatConversationListProps) {
  const { conversations, activeConversationId } = useChat();
  
  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    // Filter by contact if specified
    if (contactId && conv.contactId !== contactId) return false;
    
    // Filter by status
    if (statusFilter !== "all" && conv.status !== statusFilter) return false;
    
    // Filter by search query
    if (searchQuery) {
      const matchesTitle = conv.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProtocol = conv.protocolIds?.some(id => id.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesParticipant = conv.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (!matchesTitle && !matchesProtocol && !matchesParticipant) return false;
    }
    
    return true;
  });
  
  // Format date for display
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      // Today - show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return "Ontem";
    } else if (days < 7) {
      const weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
      return weekdays[date.getDay()];
    } else {
      // More than a week ago - show date
      return date.toLocaleDateString();
    }
  };

  if (filteredConversations.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>Nenhuma conversa encontrada</p>
        <p className="text-sm mt-1">Inicie uma nova conversa para começar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredConversations.map((conv) => {
        const isActive = activeConversationId === conv.id;
        
        // Find participant who is not the current user
        const otherParticipant = conv.participants.length > 1 ? conv.participants[1] : null;
        
        return (
          <div 
            key={conv.id}
            className={cn(
              "flex items-start p-3 rounded-md cursor-pointer transition-colors",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-muted/80"
            )}
            onClick={() => onSelectConversation(conv.id)}
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
              <MessageCircle size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="font-medium truncate">
                  {conv.title || otherParticipant?.name || "Conversa"}
                </span>
                <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                  {formatDate(conv.lastMessageTime)}
                </span>
              </div>
              
              {conv.protocolIds && conv.protocolIds.length > 0 && (
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {conv.protocolIds[0]}
                  </Badge>
                  {conv.protocolIds.length > 1 && (
                    <Badge variant="outline" className="text-xs ml-1 px-1 py-0">
                      +{conv.protocolIds.length - 1}
                    </Badge>
                  )}
                </div>
              )}
              
              <p className="text-sm text-muted-foreground truncate mt-1">
                {conv.lastMessage || "Nenhuma mensagem enviada"}
              </p>
              
              <div className="flex items-center mt-1">
                {conv.status === "active" ? (
                  <span className="flex items-center text-xs text-green-600">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1"></span>
                    Ativo
                  </span>
                ) : conv.status === "closed" ? (
                  <span className="flex items-center text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Encerrado
                  </span>
                ) : (
                  <span className="flex items-center text-xs text-amber-600">
                    <Archive className="h-3 w-3 mr-1" />
                    Arquivado
                  </span>
                )}
                
                {conv.unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {conv.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
