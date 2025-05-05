
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatContactList } from "./ChatContactList";
import { ConversationList } from "./ConversationList";
import { Input } from "@/components/ui/input";
import { Conversation, Contact } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Search, Users, MessageCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for demonstration
const mockContacts: Contact[] = [
  { id: "c1", name: "Departamento de Saúde", type: "department", status: "online" },
  { id: "c2", name: "Departamento de Educação", type: "department", status: "away" },
  { id: "c3", name: "João Silva", type: "user", userName: "joaosilva", departmentName: "Finanças", status: "online", favorite: true },
  { id: "c4", name: "Maria Oliveira", type: "user", userName: "mariaoliveira", departmentName: "Administração", status: "offline" },
];

const mockConversations: Conversation[] = [
  { 
    id: "conv1", 
    participantId: "c1", 
    participantName: "Departamento de Saúde", 
    unreadCount: 2,
    lastMessage: "Precisamos discutir o novo programa de vacinação",
    lastMessageTime: "2023-05-05T10:30:00",
    type: "department",
    protocolIds: ["SAUDE-2023-000123"]
  },
  { 
    id: "conv2", 
    participantId: "c3", 
    participantName: "João Silva", 
    unreadCount: 0,
    lastMessage: "Obrigado pelas informações.",
    lastMessageTime: "2023-05-04T16:45:00",
    type: "citizen",
    protocolIds: ["FIN-2023-000456", "ADM-2023-000789"]
  },
];

interface BaseChatViewProps {
  viewMode: "admin" | "citizen";
}

export function BaseChatView({ viewMode }: BaseChatViewProps) {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"conversations" | "contacts">("conversations");
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(mockContacts);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showConversation, setShowConversation] = useState(false);

  // Filter contacts based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = mockContacts.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.departmentName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContacts(filtered);
      
      const filteredConvs = mockConversations.filter(conv => 
        conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.protocolIds?.some(protocol => protocol.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredConversations(filteredConvs);
    } else {
      setFilteredContacts(mockContacts);
      setFilteredConversations(mockConversations);
    }
  }, [searchTerm]);

  const handleSelectContact = (id: string, name: string) => {
    // Check if a conversation already exists with this contact
    const existingConversation = mockConversations.find(conv => conv.participantId === id);
    
    if (existingConversation) {
      setSelectedConversationId(existingConversation.id);
    } else {
      // In a real app, you'd create a new conversation here
      console.log(`Starting new conversation with ${name} (ID: ${id})`);
    }
    
    if (isMobile) {
      setShowConversation(true);
    }
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    if (isMobile) {
      setShowConversation(true);
    }
  };

  const handleBackToList = () => {
    setShowConversation(false);
  };

  const renderSidebar = () => (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas ou contatos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <Tabs 
        defaultValue="conversations" 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "conversations" | "contacts")}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid grid-cols-2 mx-4 mt-2">
          <TabsTrigger value="conversations" className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            Conversas
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Contatos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="conversations" className="flex-1 overflow-hidden mt-0 p-0">
          <ConversationList 
            conversations={filteredConversations} 
            onSelect={handleSelectConversation} 
          />
        </TabsContent>
        
        <TabsContent value="contacts" className="flex-1 overflow-hidden mt-0 p-0">
          <ChatContactList 
            contacts={filteredContacts}
            onSelect={handleSelectContact}
          />
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderConversation = () => (
    <div className="flex flex-col h-full">
      {isMobile && showConversation && (
        <div className="p-2 border-b">
          <Button variant="ghost" onClick={handleBackToList} className="p-2">
            &larr; Voltar
          </Button>
        </div>
      )}
      
      <div className="flex-1 p-4 flex items-center justify-center text-muted-foreground">
        {selectedConversationId ? (
          <div className="text-center">
            <h3 className="text-lg font-medium">
              Conversando com {mockConversations.find(c => c.id === selectedConversationId)?.participantName}
            </h3>
            <p className="text-sm mt-2">
              Aqui seria exibida a conversa completa com esta pessoa ou departamento.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-lg font-medium">Selecione uma conversa</h3>
            <p className="text-sm mt-2">
              Escolha uma conversa existente ou inicie uma nova a partir da lista de contatos.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-150px)]">
      {(!isMobile || !showConversation) && (
        <div className={`${isMobile ? 'w-full' : 'w-80'} h-full`}>
          {renderSidebar()}
        </div>
      )}
      
      {(!isMobile || showConversation) && (
        <div className={`${isMobile ? 'w-full' : 'flex-1'} h-full`}>
          {renderConversation()}
        </div>
      )}
    </div>
  );
}
