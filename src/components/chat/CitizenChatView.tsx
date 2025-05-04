
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useChat, Conversation } from "@/contexts/ChatContext";
import { ConversationList } from "./ConversationList";
import { ConversationDetail } from "./ConversationDetail";
import { useAuth } from "@/contexts/AuthContext";
import { EmptyState } from "./EmptyState";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

export function CitizenChatView() {
  const { user } = useAuth();
  const { 
    activeConversationId,
    messages, 
    setActiveConversation,
    conversations,
    createConversation,
  } = useChat();
  
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  const handleCreateConversation = async () => {
    if (!user) return;
    
    try {
      const newConversation = await createConversation(
        'admin-support',
        'Atendimento',
        'internal'
      );
      
      setActiveConversation(newConversation.id);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
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
      {/* Sidebar - Conversation List */}
      {showList && (
        <div className={`${showDetail ? "w-1/3 border-r" : "w-full"} flex flex-col h-full`}>
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="font-semibold">Minhas Conversas</h2>
            <Button size="sm" onClick={handleCreateConversation}>
              <Plus className="h-4 w-4 mr-1" /> Nova
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            {conversations.length > 0 ? (
              <div className="p-2">
                <ConversationList 
                  conversations={conversations}
                  onSelect={handleSelectConversation}
                />
              </div>
            ) : (
              <EmptyState 
                title="Nenhuma conversa iniciada"
                description="Inicie uma nova conversa para entrar em contato com nossos atendentes"
                action={
                  <Button onClick={handleCreateConversation}>
                    <Plus className="h-4 w-4 mr-2" />
                    Iniciar Conversa
                  </Button>
                }
              />
            )}
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
              description="Escolha uma conversa da lista ou inicie uma nova para começar"
            />
          )}
        </div>
      )}
    </div>
  );
}
