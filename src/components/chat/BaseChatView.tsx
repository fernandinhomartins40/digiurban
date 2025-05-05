
import React, { useState, useEffect } from "react";
import { useChat } from "@/contexts/ChatContext";
import { ConversationList } from "./ConversationList";
import { ConversationDetail } from "./ConversationDetail";
import { ChatContactList } from "./ChatContactList";
import { EmptyState } from "./EmptyState";
import { Button } from "@/components/ui/button";
import { MessageSquare, User, Users, Search, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

export interface BaseChatViewProps {
  viewMode?: "admin" | "citizen";
}

export function BaseChatView({ viewMode = "admin" }: BaseChatViewProps) {
  const {
    activeConversationId,
    setActiveConversation,
    conversations,
    contacts,
    createConversation,
  } = useChat();

  const [activeTab, setActiveTab] = useState<"chats" | "contacts">("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const isMobile = useIsMobile();

  // Filter conversations by search query
  const filteredConversations = conversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter contacts by search query
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle selecting a conversation
  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    if (isMobile) {
      setShowDetail(true);
    }
  };

  // Handle selecting a contact
  const handleSelectContact = (contactId: string, contactName: string) => {
    // Check if there's already a conversation with this contact
    const existingConversation = conversations.find(
      (conv) => conv.participantId === contactId && conv.type !== "internal"
    );

    if (existingConversation) {
      setActiveConversation(existingConversation.id);
    } else {
      // Create a new conversation with this contact
      createConversation(contactId, contactName, viewMode === "admin" ? "citizen" : "internal")
        .then((newConversation) => {
          setActiveConversation(newConversation.id);
        })
        .catch((error) => {
          console.error("Error creating conversation:", error);
        });
    }

    if (isMobile) {
      setShowDetail(true);
    }
  };

  // Handle back navigation on mobile
  const handleBack = () => {
    if (isMobile) {
      setShowDetail(false);
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Sidebar - Contacts and Conversations */}
      {(!isMobile || !showDetail) && (
        <div className="w-full md:w-1/3 border-r flex flex-col h-full">
          <div className="p-4 border-b">
            <Tabs
              defaultValue="chats"
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "chats" | "contacts")}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="chats">
                  <MessageSquare className="h-4 w-4 mr-2" /> Conversas
                </TabsTrigger>
                <TabsTrigger value="contacts">
                  <User className="h-4 w-4 mr-2" /> Contatos
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <TabsContent value="chats" className="mt-4 p-0">
                <div>
                  {filteredConversations.length > 0 ? (
                    <ConversationList
                      conversations={filteredConversations}
                      onSelect={handleSelectConversation}
                    />
                  ) : (
                    <EmptyState
                      title="Nenhuma conversa encontrada"
                      description={
                        searchQuery
                          ? "Tente outro termo de pesquisa"
                          : "Você ainda não tem conversas ativas"
                      }
                      icon={<MessageSquare className="h-12 w-12 text-muted-foreground" />}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="contacts" className="mt-4 p-0">
                <div>
                  {filteredContacts.length > 0 ? (
                    <ChatContactList
                      contacts={filteredContacts}
                      onSelect={handleSelectContact}
                    />
                  ) : (
                    <EmptyState
                      title="Nenhum contato encontrado"
                      description={
                        searchQuery
                          ? "Tente outro termo de pesquisa"
                          : "Você ainda não tem contatos"
                      }
                      icon={<Users className="h-12 w-12 text-muted-foreground" />}
                    />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {/* Main Content - Conversation Detail */}
      {(!isMobile || showDetail) && (
        <div className="w-full md:w-2/3 flex flex-col h-full">
          {activeConversationId ? (
            <ConversationDetail onBack={handleBack} />
          ) : (
            <EmptyState
              title="Selecione uma conversa"
              description="Escolha uma conversa da lista ou um contato para iniciar uma nova conversa"
            />
          )}
        </div>
      )}
    </div>
  );
}
