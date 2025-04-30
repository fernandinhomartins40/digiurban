
import React, { useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, ArrowLeft, Search, Filter } from "lucide-react";
import { ConversationList } from "@/components/chat/ConversationList";
import { EmptyState } from "@/components/chat/EmptyState";
import { ConversationDetail } from "@/components/chat/ConversationDetail";
import { ChatSearch } from "@/components/chat/ChatSearch";
import { ChatFilters } from "@/components/chat/ChatFilters";

export default function CitizenChatPage() {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversation,
    loading 
  } = useChat();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "closed">("all");
  
  // Filter conversations - citizens only see their own conversations
  const citizenConversations = conversations
    .filter(conv => conv.type === "citizen")
    .filter(conv => statusFilter === "all" || conv.status === statusFilter)
    .filter(conv => 
      searchQuery === "" || 
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (conv.protocolId && conv.protocolId.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Chat</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe suas solicitações e conversas com a prefeitura
          </p>
        </div>
      </div>

      {activeConversationId ? (
        <ConversationDetail
          onBack={() => setActiveConversation(null)}
        />
      ) : (
        <div className="border rounded-lg flex-1">
          <div className="border-b p-3">
            <div className="flex items-center gap-2">
              <ChatSearch 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <ChatFilters
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
            </div>
          </div>

          {citizenConversations.length === 0 ? (
            <EmptyState
              title="Nenhuma conversa ativa"
              description="Você não possui nenhuma conversa ativa no momento. As conversas são iniciadas após protocolos serem abertos."
              icon={<MessageCircle className="h-6 w-6 text-primary" />}
            />
          ) : (
            <ScrollArea className="flex-1 p-3 h-full">
              <ConversationList
                conversations={citizenConversations}
                onSelect={setActiveConversation}
              />
            </ScrollArea>
          )}
        </div>
      )}
    </div>
  );
}
