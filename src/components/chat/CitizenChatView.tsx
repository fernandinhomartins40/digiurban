
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useChat, Conversation } from "@/contexts/ChatContext";
import { ConversationList } from "./ConversationList";
import { ConversationDetail } from "./ConversationDetail";
import { useAuth } from "@/contexts/AuthContext";
import { EmptyState } from "./EmptyState";
import { MessageSquare, User, Users, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatContactList } from "./ChatContactList";

export function CitizenChatView() {
  const { user } = useAuth();
  const { 
    activeConversationId,
    messages, 
    setActiveConversation,
    conversations,
    contacts,
    createConversation,
  } = useChat();
  
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<"chats" | "contacts">("chats");

  const handleCreateConversation = async () => {
    if (!user) return;
    
    try {
      const newConversation = await createConversation(
        'admin-support',
        'Atendimento',
        'internal'
      );
      
      setActiveConversation(newConversation.id);
      if (isMobile) {
        setShowMobileDetail(true);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    setShowMobileDetail(true);
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
      createConversation(contactId, contactName, "admin")
        .then((newConversation) => {
          setActiveConversation(newConversation.id);
        })
        .catch((error) => {
          console.error("Error creating conversation:", error);
        });
    }
    setShowMobileDetail(true);
  };

  const handleBackToList = () => {
    setShowMobileDetail(false);
  };

  // On mobile, show either the list or the detail view
  const showList = !isMobile || !showMobileDetail;
  const showDetail = !isMobile || showMobileDetail;

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Sidebar - Contacts and Conversations */}
      {showList && (
        <div className={`${showDetail ? "w-1/3 border-r" : "w-full"} flex flex-col h-full`}>
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
                  {/* New Conversation Button - Always visible */}
                  <div className="mb-3">
                    <Button 
                      onClick={handleCreateConversation}
                      className="w-full"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Conversa
                    </Button>
                  </div>
                  
                  {conversations.length > 0 ? (
                    <ConversationList
                      conversations={conversations}
                      onSelect={handleSelectConversation}
                    />
                  ) : (
                    <EmptyState
                      title="Nenhuma conversa iniciada"
                      description="Inicie uma nova conversa para entrar em contato com nossos atendentes"
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
                      description="Você ainda não tem contatos disponíveis"
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
      {showDetail && (
        <div className={`${showList ? "w-2/3" : "w-full"} flex flex-col h-full`}>
          {activeConversationId ? (
            <ConversationDetail onBack={handleBackToList} />
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
