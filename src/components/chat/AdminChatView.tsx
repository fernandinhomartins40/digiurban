
import React, { useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { ConversationList } from "./ConversationList";
import { ConversationDetail } from "./ConversationDetail";
import { ChatContactList } from "./ChatContactList";
import { EmptyState } from "./EmptyState";
import { Button } from "@/components/ui/button";
import { MessageSquare, User, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AdminChatView() {
  const {
    activeConversationId,
    setActiveConversation,
    conversations,
    contacts,
    createConversation,
  } = useChat();

  const [activeTab, setActiveTab] = useState<"chats" | "contacts">("chats");

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
  };

  const handleSelectContact = (contactId: string, contactName: string) => {
    // Check if there's already a conversation with this contact
    const existingConversation = conversations.find(
      conv => conv.participantId === contactId && conv.type !== "internal"
    );

    if (existingConversation) {
      setActiveConversation(existingConversation.id);
    } else {
      // Create a new conversation with this contact
      createConversation(contactId, contactName, "citizen")
        .then((newConversation) => {
          setActiveConversation(newConversation.id);
        })
        .catch((error) => {
          console.error("Error creating conversation:", error);
        });
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Sidebar - Contacts and Conversations */}
      <div className="w-1/3 border-r flex flex-col h-full">
        <div className="p-2 border-b">
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
            
            <TabsContent value="chats" className="mt-0">
              <div className="p-2">
                {conversations.length > 0 ? (
                  <ConversationList
                    conversations={conversations}
                    onSelect={handleSelectConversation}
                  />
                ) : (
                  <EmptyState
                    title="Nenhuma conversa iniciada"
                    description="Você ainda não tem conversas ativas"
                    icon={<MessageSquare className="h-12 w-12 text-muted-foreground" />}
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="contacts" className="mt-0">
              <div className="p-2">
                {contacts.length > 0 ? (
                  <ChatContactList 
                    contacts={contacts} 
                    onSelect={handleSelectContact}
                  />
                ) : (
                  <EmptyState
                    title="Nenhum contato"
                    description="Você ainda não tem contatos"
                    icon={<Users className="h-12 w-12 text-muted-foreground" />}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Main Content - Conversation Detail */}
      <div className="w-2/3 flex flex-col h-full">
        {activeConversationId ? (
          <ConversationDetail onBack={() => {}} />
        ) : (
          <EmptyState 
            title="Selecione uma conversa"
            description="Escolha uma conversa da lista ou um contato para iniciar uma nova conversa"
          />
        )}
      </div>
    </div>
  );
}
