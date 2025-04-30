
import React, { useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  Search, 
  Filter, 
  Plus,
  User,
  Users
} from "lucide-react";
import { ConversationList } from "@/components/chat/ConversationList";
import { EmptyState } from "@/components/chat/EmptyState";
import { CreateConversationDialog } from "@/components/chat/CreateConversationDialog";
import { ConversationDetail } from "@/components/chat/ConversationDetail";
import { ChatSearch } from "@/components/chat/ChatSearch";
import { ChatFilters } from "@/components/chat/ChatFilters";

export default function AdminChatPage() {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversation,
    loading
  } = useChat();
  
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "closed">("all");
  
  // Filter conversations by type
  const citizenConversations = conversations
    .filter(conv => conv.type === "citizen")
    .filter(conv => statusFilter === "all" || conv.status === statusFilter)
    .filter(conv => 
      searchQuery === "" || 
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (conv.protocolId && conv.protocolId.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  
  const internalConversations = conversations
    .filter(conv => conv.type === "internal")
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
            Gerencie todas as suas conversas em um só lugar
          </p>
        </div>
        <Button onClick={() => setShowNewConversationDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova conversa
        </Button>
      </div>

      {activeConversationId ? (
        <ConversationDetail
          onBack={() => setActiveConversation(null)}
        />
      ) : (
        <div className="border rounded-lg flex-1">
          <Tabs defaultValue="citizens" className="h-full flex flex-col">
            <div className="border-b p-2">
              <div className="flex items-center justify-between mb-2">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="citizens">Cidadãos</TabsTrigger>
                  <TabsTrigger value="internal">Interno</TabsTrigger>
                </TabsList>
              </div>
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

            <TabsContent value="citizens" className="flex-1 overflow-hidden m-0">
              {citizenConversations.length === 0 ? (
                <EmptyState
                  title="Nenhuma conversa com cidadãos"
                  description="Não existem conversas ativas com cidadãos relacionadas ao seu departamento."
                  icon={<User className="h-6 w-6 text-primary" />}
                />
              ) : (
                <ScrollArea className="flex-1 p-3 h-full">
                  <ConversationList
                    conversations={citizenConversations}
                    onSelect={setActiveConversation}
                  />
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent value="internal" className="flex-1 overflow-hidden m-0">
              {internalConversations.length === 0 ? (
                <EmptyState
                  title="Nenhuma conversa interna"
                  description="Não existem conversas internas ativas. Clique em 'Nova conversa' para iniciar."
                  icon={<Users className="h-6 w-6 text-primary" />}
                />
              ) : (
                <ScrollArea className="flex-1 p-3 h-full">
                  <ConversationList
                    conversations={internalConversations}
                    onSelect={setActiveConversation}
                  />
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      <CreateConversationDialog
        open={showNewConversationDialog}
        onOpenChange={setShowNewConversationDialog}
      />
    </div>
  );
}
