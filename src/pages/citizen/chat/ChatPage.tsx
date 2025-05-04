import React, { useState, useEffect } from "react";
import { useChat } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, ArrowLeft, Search, Filter, Bell, Settings } from "lucide-react";
import { ChatContactList } from "@/components/chat/ChatContactList";
import { ChatConversationList } from "@/components/chat/ChatConversationList";
import { ConversationDetail } from "@/components/chat/ConversationDetail";
import { ChatSearch } from "@/components/chat/ChatSearch";
import { ChatFilters } from "@/components/chat/ChatFilters";
import { NewChatDialog } from "@/components/chat/NewChatDialog";
import { EmptyState } from "@/components/chat/EmptyState";
import { Badge } from "@/components/ui/badge";
import { NotificationsSheet } from "@/components/chat/NotificationsSheet";
import { ChatSettingsSheet } from "@/components/chat/ChatSettingsSheet";

export default function CitizenChatPage() {
  const { 
    conversations, 
    activeConversationId, 
    activeContactId,
    setActiveConversation,
    setActiveContact,
    loading,
    contacts,
    unreadCount,
    viewNotifications,
    openChatSettings
  } = useChat();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "closed">("all");
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);
  
  // Check for mobile view on mount and window resize
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);
  
  // Handle back navigation in mobile view
  const handleBackFromConversation = () => {
    setActiveConversation(null);
  };

  const handleBackFromContact = () => {
    setActiveContact(null);
  };
  
  const handleOpenNotifications = () => {
    setShowNotificationsDrawer(true);
    viewNotifications(); // Mark as viewed in context
  };
  
  const handleOpenSettings = () => {
    setShowSettingsSheet(true);
    openChatSettings(); // Open settings in context
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Filter conversations - citizens only see their own conversations
  const citizenConversations = conversations
    .filter(conv => conv.type === "citizen")
    .filter(conv => statusFilter === "all" || conv.status === statusFilter)
    .filter(conv => 
      searchQuery === "" || 
      conv.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (conv.protocolIds && conv.protocolIds.some(id => id.toLowerCase().includes(searchQuery.toLowerCase())))
    );

  // Filter available contacts - citizens only see departments
  const availableContacts = contacts.filter(contact => contact.type === "department");

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Chat</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe suas solicitações e conversas com a prefeitura
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            title="Configurações"
            onClick={handleOpenSettings}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <div className="relative">
            <Button 
              variant="outline" 
              size="icon" 
              title="Notificações"
              onClick={handleOpenNotifications}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 text-[10px] flex items-center justify-center p-0 rounded-full"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>
          <Button onClick={() => setShowNewChatDialog(true)}>
            Iniciar conversa
          </Button>
        </div>
      </div>

      <div className="border rounded-lg flex-1 overflow-hidden">
        {/* Two/Three-column layout */}
        <div className={`h-full grid ${
          isMobileView 
            ? "grid-cols-1" 
            : activeConversationId 
              ? "grid-cols-[250px_1fr]" 
              : activeContactId
                ? "grid-cols-[250px_1fr]"
                : "grid-cols-[1fr]"
        }`}>
          {/* Column 1: Contacts (Hidden in mobile when conversation is active) */}
          {(!isMobileView || (!activeContactId && !activeConversationId)) && (
            <div className="h-full flex flex-col">
              <div className="p-3 border-b">
                <h3 className="font-medium text-sm mb-2">Secretarias e Departamentos</h3>
                <ChatSearch 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder="Buscar departamentos..."
                />
              </div>
              
              <ScrollArea className="flex-1 p-2">
                {availableContacts.length > 0 ? (
                  <ChatContactList 
                    type="department"
                    searchQuery={searchQuery}
                    onSelectContact={setActiveContact}
                    activeContactId={activeContactId}
                  />
                ) : (
                  <EmptyState
                    title="Nenhum departamento disponível"
                    description="Não há departamentos disponíveis no momento."
                    icon={<MessageCircle className="h-6 w-6 text-primary" />}
                  />
                )}
              </ScrollArea>
            </div>
          )}
          
          {/* Column 2: Conversations with selected contact (Hidden in mobile when no contact is selected or conversation is active) */}
          {(!isMobileView && activeContactId && !activeConversationId) || (isMobileView && activeContactId && !activeConversationId) ? (
            <div className="h-full flex flex-col border-l">
              <div className="p-3 border-b flex items-center">
                {isMobileView && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="mr-2" 
                    onClick={handleBackFromContact}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <div className="flex-1">
                  <h3 className="font-medium">
                    {contacts.find(c => c.id === activeContactId)?.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {contacts.find(c => c.id === activeContactId)?.description}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => setShowNewChatDialog(true)}
                  title="Iniciar nova conversa"
                >
                  Iniciar conversa
                </Button>
              </div>
              
              <div className="p-3 border-b">
                <ChatFilters
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                />
              </div>
              
              <ScrollArea className="flex-1">
                <div className="p-3">
                  <ChatConversationList
                    contactId={activeContactId}
                    statusFilter={statusFilter}
                    searchQuery=""
                    onSelectConversation={setActiveConversation}
                  />
                </div>
              </ScrollArea>
            </div>
          ) : null}
          
          {/* Column 3: Active Conversation or Empty state */}
          {(!isMobileView || activeConversationId) ? (
            activeConversationId ? (
              <div className="h-full bg-background border-l">
                <ConversationDetail
                  onBack={isMobileView ? handleBackFromConversation : undefined}
                />
              </div>
            ) : !activeContactId ? (
              <div className="h-full flex items-center justify-center flex-col p-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageCircle className="h-10 w-10 text-primary opacity-80" />
                </div>
                <h3 className="text-xl font-medium mb-2">Bem-vindo ao Chat</h3>
                <p className="text-center text-muted-foreground mb-6 max-w-md">
                  Selecione um departamento para ver suas conversas ou inicie uma nova conversa.
                </p>
                <Button onClick={() => setShowNewChatDialog(true)}>
                  Iniciar uma conversa
                </Button>
              </div>
            ) : null
          ) : null}
        </div>
      </div>

      <NewChatDialog
        open={showNewChatDialog}
        onOpenChange={setShowNewChatDialog}
        initialContactId={activeContactId}
      />
      
      <NotificationsSheet 
        open={showNotificationsDrawer}
        onOpenChange={setShowNotificationsDrawer}
      />
      
      <ChatSettingsSheet
        open={showSettingsSheet}
        onOpenChange={setShowSettingsSheet}
      />
    </div>
  );
}
