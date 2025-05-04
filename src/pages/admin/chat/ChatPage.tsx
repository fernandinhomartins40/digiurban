
import React, { useState, useEffect } from "react";
import { useChat } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Filter, 
  Plus,
  User,
  Users,
  MessageCircle,
  Bell,
  Settings,
  Phone,
  Mail
} from "lucide-react";
import { ChatContactList } from "@/components/chat/ChatContactList";
import { ChatConversationList } from "@/components/chat/ChatConversationList";
import { ConversationDetail } from "@/components/chat/ConversationDetail";
import { ChatSearch } from "@/components/chat/ChatSearch";
import { ChatFilters } from "@/components/chat/ChatFilters";
import { NewChatDialog } from "@/components/chat/NewChatDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function AdminChatPage() {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversation,
    contacts,
    activeContactId,
    setActiveContact,
    loading,
    unreadCount
  } = useChat();
  
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "closed">("all");
  const [isMobileView, setIsMobileView] = useState(false);
  
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
        <div className="flex gap-2">
          <Button variant="outline" size="icon" title="Configurações">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" position="relative" title="Notificações">
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
          <Button onClick={() => setShowNewChatDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova conversa
          </Button>
        </div>
      </div>

      <div className="border rounded-lg flex-1 overflow-hidden">
        {/* Three-column layout for desktop */}
        <div className={cn(
          "h-full grid",
          isMobileView 
            ? "grid-cols-1" 
            : activeConversationId 
              ? "grid-cols-[250px_300px_1fr]" 
              : activeContactId
                ? "grid-cols-[250px_1fr]"
                : "grid-cols-[250px_1fr]"
        )}>
          {/* Column 1: Contacts (Hidden in mobile when conversation is active) */}
          {(!isMobileView || (!activeContactId && !activeConversationId)) && (
            <div className="border-r h-full flex flex-col">
              <div className="p-3 border-b">
                <h3 className="font-medium text-sm mb-2">Contatos</h3>
                <ChatSearch 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder="Buscar contatos..."
                />
              </div>
              <Tabs defaultValue="departments" className="flex-1 flex flex-col">
                <div className="px-2 pt-2">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="departments">Setores</TabsTrigger>
                    <TabsTrigger value="citizens">Cidadãos</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="departments" className="flex-1 m-0 overflow-hidden">
                  <ScrollArea className="h-full p-2">
                    <ChatContactList 
                      type="department"
                      searchQuery={searchQuery}
                      onSelectContact={setActiveContact}
                      activeContactId={activeContactId}
                    />
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="citizens" className="flex-1 m-0 overflow-hidden">
                  <ScrollArea className="h-full p-2">
                    <ChatContactList 
                      type="citizen"
                      searchQuery={searchQuery}
                      onSelectContact={setActiveContact}
                      activeContactId={activeContactId}
                    />
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {/* Column 2: Conversations with selected contact (Hidden in mobile when no contact is selected or conversation is active) */}
          {(!isMobileView && activeContactId && !activeConversationId) || (isMobileView && activeContactId && !activeConversationId) ? (
            <div className="h-full flex flex-col">
              <div className="p-3 border-b flex items-center">
                {isMobileView && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="mr-2" 
                    onClick={handleBackFromContact}
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                  </Button>
                )}
                <div className="flex-1">
                  <h3 className="font-medium">
                    {contacts.find(c => c.id === activeContactId)?.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {contacts.find(c => c.id === activeContactId)?.type === "department" 
                      ? "Departamento" 
                      : "Cidadão"}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => setShowNewChatDialog(true)}
                  title="Iniciar nova conversa"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova
                </Button>
              </div>
              <div className="p-3 border-b">
                <ChatSearch 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder="Buscar conversas..."
                />
                <div className="flex items-center gap-2 mt-2">
                  <ChatFilters
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-3">
                  <ChatConversationList
                    contactId={activeContactId}
                    statusFilter={statusFilter}
                    searchQuery={searchQuery}
                    onSelectConversation={setActiveConversation}
                  />
                </div>
              </ScrollArea>
            </div>
          ) : null}
          
          {/* Column 3: Active Conversation or Empty state */}
          {(!isMobileView || activeConversationId) && (
            <div className="h-full bg-background">
              {activeConversationId ? (
                <ConversationDetail
                  onBack={isMobileView ? handleBackFromConversation : undefined}
                />
              ) : (
                <div className="h-full flex items-center justify-center flex-col p-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageCircle className="h-10 w-10 text-primary opacity-80" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Bem-vindo ao Chat</h3>
                  <p className="text-center text-muted-foreground mb-6 max-w-md">
                    Selecione um contato para ver suas conversas ou inicie uma nova conversa clicando no botão acima.
                  </p>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setActiveContact("dept-1")}>
                      <Users className="mr-2 h-4 w-4" />
                      Ver departamentos
                    </Button>
                    <Button onClick={() => setShowNewChatDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nova conversa
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <NewChatDialog
        open={showNewChatDialog}
        onOpenChange={setShowNewChatDialog}
        initialContactId={activeContactId}
      />
    </div>
  );
}
