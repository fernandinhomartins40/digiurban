import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Define types for our chat system
export type ChatType = "citizen" | "internal";
export type ContactType = "department" | "citizen" | "admin";
export type OnlineStatus = "online" | "offline" | "away";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: "citizen" | "admin" | "system";
  protocolId?: string;
  content: string;
  timestamp: string;
  read: boolean;
  replyToMessageId?: string;
  replyToContent?: string;
  reactions?: {
    type: string;
    userId: string;
    userName: string;
  }[];
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

export interface ChatContact {
  id: string;
  name: string;
  type: ContactType;
  avatar?: string;
  description?: string;
  status: OnlineStatus;
  departmentId?: string;
  departmentName?: string;
  lastActivity?: string;
  tags?: string[];
  favorite?: boolean;
}

export interface ChatConversation {
  id: string;
  title?: string;
  type: ChatType;
  participants: {
    id: string;
    name: string;
    departmentId?: string;
    departmentName?: string;
    online?: boolean;
    role?: string;
  }[];
  contactId: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  protocolIds?: string[];
  status: "active" | "archived" | "closed";
  createdAt: string;
  tags?: string[];
}

interface ChatContextType {
  conversations: ChatConversation[];
  contacts: ChatContact[];
  activeConversationId: string | null;
  activeContactId: string | null;
  messages: Record<string, ChatMessage[]>;
  loading: boolean;
  error: string | null;
  unreadCount: number;
  
  // Actions
  setActiveConversation: (conversationId: string | null) => void;
  setActiveContact: (contactId: string | null) => void;
  sendMessage: (conversationId: string, content: string, attachments?: File[], replyToMessageId?: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  closeConversation: (conversationId: string) => Promise<void>;
  createConversation: (
    type: ChatType, 
    contactId: string, 
    title?: string, 
    protocolIds?: string[]
  ) => Promise<string>;
  loadMoreMessages: (conversationId: string) => Promise<void>;
  addReaction: (conversationId: string, messageId: string, reactionType: string) => Promise<void>;
  searchConversations: (query: string) => ChatConversation[];
  filterConversationsByStatus: (status: "active" | "archived" | "closed" | "all") => ChatConversation[];
  toggleContactFavorite: (contactId: string) => void;
  addTagToConversation: (conversationId: string, tag: string) => void;
  removeTagFromConversation: (conversationId: string, tag: string) => void;
  addProtocolToConversation: (conversationId: string, protocolId: string) => Promise<void>;
}

// Create the initial context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mock contacts for demo purposes
const MOCK_CONTACTS: ChatContact[] = [
  {
    id: "dept-1",
    name: "Secretaria de Saúde",
    type: "department",
    status: "online",
    description: "Atendimento relacionado à saúde pública",
    tags: ["saúde", "hospitais", "medicamentos"]
  },
  {
    id: "dept-2",
    name: "Ouvidoria Municipal",
    type: "department",
    status: "online",
    description: "Reclamações, sugestões e elogios",
    tags: ["reclamação", "sugestão", "elogio"]
  },
  {
    id: "dept-3",
    name: "Secretaria de Obras",
    type: "department",
    status: "offline",
    description: "Informações sobre obras públicas",
    tags: ["infraestrutura", "construção", "reparos"]
  },
  {
    id: "dept-4",
    name: "Secretaria de Educação",
    type: "department",
    status: "away",
    description: "Assuntos relacionados à educação municipal",
    tags: ["escolas", "matrículas", "professores"]
  },
  {
    id: "user-1",
    name: "Maria Silva",
    type: "citizen",
    status: "online",
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "user-2",
    name: "João Santos",
    type: "citizen",
    status: "offline",
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "user-3",
    name: "Ana Oliveira",
    type: "citizen",
    status: "online",
    lastActivity: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: "admin-1",
    name: "Carlos Mendes",
    type: "admin",
    departmentId: "dept-1",
    departmentName: "Secretaria de Saúde",
    status: "online",
  },
  {
    id: "admin-2",
    name: "Juliana Alves",
    type: "admin",
    departmentId: "dept-2",
    departmentName: "Ouvidoria Municipal",
    status: "away",
  }
];

// For demo purposes until we connect to the database
const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: "conv1",
    title: "Atendimento Saúde",
    type: "citizen",
    contactId: "dept-1",
    participants: [
      { id: "dept-1", name: "Secretaria de Saúde", departmentId: "health" },
      { id: "user-1", name: "Maria Silva" }
    ],
    lastMessage: "Sua solicitação foi recebida",
    lastMessageTime: new Date().toISOString(),
    unreadCount: 2,
    protocolIds: ["2025-000123"],
    status: "active",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["urgente", "medicamentos"]
  },
  {
    id: "conv2",
    title: "Reclamação Rua",
    type: "citizen",
    contactId: "dept-2",
    participants: [
      { id: "dept-2", name: "Ouvidoria Municipal", departmentId: "ombudsman" },
      { id: "user-1", name: "Maria Silva" }
    ],
    lastMessage: "Protocolo #12345 aberto",
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    protocolIds: ["2025-000124"],
    status: "active",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "conv3",
    title: "Suporte Técnico",
    type: "internal",
    contactId: "admin-1",
    participants: [
      { id: "admin-1", name: "Carlos Mendes", departmentId: "tech", departmentName: "TI" },
      { id: "admin-2", name: "Juliana Alves", departmentId: "finance", departmentName: "Finanças" },
    ],
    lastMessage: "Você pode verificar o problema com o sistema?",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unreadCount: 1,
    status: "active",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "conv4",
    title: "Obra Praça Central",
    type: "citizen",
    contactId: "dept-3",
    participants: [
      { id: "dept-3", name: "Secretaria de Obras", departmentId: "works" },
      { id: "user-2", name: "João Santos" }
    ],
    lastMessage: "Solicitação de reparo concluída",
    lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    protocolIds: ["2025-000125"],
    status: "closed",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "conv5",
    title: "Documentação Fiscal",
    type: "internal",
    contactId: "admin-2",
    participants: [
      { id: "admin-1", name: "Carlos Mendes", departmentId: "finance", departmentName: "Finanças" },
      { id: "admin-2", name: "Juliana Alves", departmentId: "legal", departmentName: "Jurídico" },
    ],
    lastMessage: "Documentos enviados para análise",
    lastMessageTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    status: "closed",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock messages for demo
const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  "conv1": [
    {
      id: "m1",
      senderId: "dept-1",
      senderName: "Secretaria de Saúde",
      senderType: "admin",
      protocolId: "2025-000123",
      content: "Olá! Como posso ajudar com sua solicitação?",
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "m2",
      senderId: "user-1",
      senderName: "Maria Silva",
      senderType: "citizen",
      protocolId: "2025-000123",
      content: "Gostaria de informações sobre agendamento de consultas",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "m3",
      senderId: "dept-1",
      senderName: "Secretaria de Saúde",
      senderType: "admin",
      protocolId: "2025-000123",
      content: "Claro! Para agendar uma consulta, você precisa comparecer à unidade de saúde mais próxima com seus documentos pessoais e cartão do SUS.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: "m4",
      senderId: "dept-1",
      senderName: "Secretaria de Saúde",
      senderType: "admin",
      protocolId: "2025-000123",
      content: "Você também pode agendar pelo aplicativo ou pelo telefone 0800-123-4567.",
      timestamp: new Date(Date.now() - 29 * 60 * 1000).toISOString(),
      read: false,
      attachments: [
        {
          id: "att1",
          name: "calendario_consultas.pdf",
          url: "#",
          type: "application/pdf",
          size: 256000
        }
      ]
    }
  ],
  "conv3": [
    {
      id: "m5",
      senderId: "admin-1",
      senderName: "Carlos Mendes",
      senderType: "admin",
      content: "Olá Juliana, estou com um problema no sistema financeiro.",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "m6",
      senderId: "admin-2",
      senderName: "Juliana Alves",
      senderType: "admin",
      content: "Oi Carlos, qual é o problema que você está enfrentando?",
      timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "m7",
      senderId: "admin-1",
      senderName: "Carlos Mendes",
      senderType: "admin",
      content: "O relatório mensal não está sendo gerado corretamente. Você pode verificar o problema com o sistema?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
    }
  ]
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, userType } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load conversations and contacts based on user type
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // In a real implementation, we would fetch from the database here
    setLoading(true);
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      // Load different conversations based on user type
      const loadedConversations = MOCK_CONVERSATIONS.filter(conv => {
        if (userType === "citizen") {
          return conv.type === "citizen" && conv.participants.some(p => p.id === user.id);
        } else {
          // Admin can see both types of conversations based on their department
          return true;
        }
      });

      // Load contacts
      const loadedContacts = MOCK_CONTACTS.filter(contact => {
        if (userType === "citizen") {
          return contact.type === "department";
        } else {
          // Admin can see all contacts
          return true;
        }
      });

      // Sort conversations by last message time (most recent first)
      loadedConversations.sort((a, b) => {
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;
        return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
      });

      // Calculate total unread count
      const totalUnread = loadedConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

      setConversations(loadedConversations);
      setContacts(loadedContacts);
      setMessages(MOCK_MESSAGES);
      setUnreadCount(totalUnread);
      setLoading(false);
    }, 500); // Simulate network delay

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, userType]);

  const setActiveConversation = (conversationId: string | null) => {
    setActiveConversationId(conversationId);
    
    // If a conversation is selected, also set the active contact
    if (conversationId) {
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        setActiveContactId(conversation.contactId);
      }
      
      // Mark messages as read
      markAsRead(conversationId);
    }
  };

  const setActiveContact = (contactId: string | null) => {
    setActiveContactId(contactId);
    // Clear active conversation when changing contacts
    setActiveConversationId(null);
  };

  const sendMessage = async (conversationId: string, content: string, attachments?: File[], replyToMessageId?: string) => {
    if (!user || !conversationId) return;
    
    // In a real implementation, we'd send to the database here
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    
    let replyToContent: string | undefined;
    
    if (replyToMessageId) {
      const repliedMessage = messages[conversationId]?.find(m => m.id === replyToMessageId);
      replyToContent = repliedMessage?.content;
    }
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderType: userType === "citizen" ? "citizen" : "admin",
      content,
      timestamp: new Date().toISOString(),
      read: false,
      replyToMessageId,
      replyToContent,
    };

    // If there are attachments, process them (would upload to storage in real implementation)
    if (attachments?.length) {
      newMessage.attachments = attachments.map(file => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: file.name,
        url: URL.createObjectURL(file), // Just for demo
        type: file.type,
        size: file.size
      }));
    }

    // Update messages state
    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }));

    // Update conversation's last message and time
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
              lastMessageTime: newMessage.timestamp,
            }
          : conv
      )
    );
    
    toast({
      title: "Mensagem enviada",
      description: "Sua mensagem foi enviada com sucesso.",
    });
  };

  const markAsRead = async (conversationId: string) => {
    // Mark messages as read in database
    // For now, just update local state
    setMessages(prev => {
      if (!prev[conversationId]) return prev;
      
      return {
        ...prev,
        [conversationId]: prev[conversationId].map(message => ({
          ...message,
          read: true,
        })),
      };
    });

    // Update unread count in conversations
    setConversations(prev => {
      const updatedConversations = prev.map(conv => 
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      );
      
      // Recalculate total unread count
      const totalUnread = updatedConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
      setUnreadCount(totalUnread);
      
      return updatedConversations;
    });
  };

  const closeConversation = async (conversationId: string) => {
    // In real implementation, update the conversation status in the database
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId
          ? { ...conv, status: "closed" }
          : conv
      )
    );
    
    toast({
      title: "Conversa encerrada",
      description: "A conversa foi encerrada com sucesso.",
    });
    
    if (activeConversationId === conversationId) {
      setActiveConversationId(null);
    }
  };

  const createConversation = async (
    type: ChatType, 
    contactId: string, 
    title?: string, 
    protocolIds?: string[]
  ): Promise<string> => {
    // In real implementation, create the conversation in the database
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) {
      throw new Error("Contato não encontrado");
    }
    
    // Generate title if not provided
    const conversationTitle = title || `Conversa com ${contact.name}`;
    
    const conversationType: ChatType = contact.type === "citizen" ? "internal" : "citizen";
    
    const newConversation: ChatConversation = {
      id: `conv-${Date.now()}`,
      title: conversationTitle,
      type: conversationType,
      contactId,
      participants: [
        { id: user?.id || "", name: user?.name || "Você" },
        { id: contactId, name: contact.name }
      ],
      unreadCount: 0,
      protocolIds,
      status: "active",
      createdAt: new Date().toISOString(),
      lastMessageTime: new Date().toISOString(),
    };

    setConversations(prev => [newConversation, ...prev]);
    
    toast({
      title: "Conversa criada",
      description: "Nova conversa iniciada com sucesso.",
    });
    
    return newConversation.id;
  };

  const loadMoreMessages = async (conversationId: string) => {
    // In real implementation, load more messages from the database
    // For now just show a toast
    toast({
      description: "Carregando mensagens anteriores...",
    });
  };

  const addReaction = async (conversationId: string, messageId: string, reactionType: string) => {
    // In real implementation, add reaction to the message in the database
    setMessages(prev => {
      if (!prev[conversationId]) return prev;
      
      return {
        ...prev,
        [conversationId]: prev[conversationId].map(message => {
          if (message.id !== messageId) return message;
          
          const reactions = message.reactions || [];
          // Remove existing reaction from same user if any
          const filteredReactions = reactions.filter(r => r.userId !== user?.id);
          
          return {
            ...message,
            reactions: [
              ...filteredReactions,
              { type: reactionType, userId: user?.id || "", userName: user?.name || "Você" }
            ]
          };
        }),
      };
    });
    
    toast({
      description: "Reação adicionada",
    });
  };

  const searchConversations = (query: string): ChatConversation[] => {
    if (!query.trim()) return conversations;
    
    return conversations.filter(conv => 
      conv.title?.toLowerCase().includes(query.toLowerCase()) ||
      (conv.protocolIds && conv.protocolIds.some(p => p.toLowerCase().includes(query.toLowerCase()))) ||
      (conv.tags && conv.tags.some(t => t.toLowerCase().includes(query.toLowerCase())))
    );
  };

  const filterConversationsByStatus = (status: "active" | "archived" | "closed" | "all"): ChatConversation[] => {
    if (status === "all") return conversations;
    
    return conversations.filter(conv => conv.status === status);
  };

  const toggleContactFavorite = (contactId: string) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === contactId
          ? { ...contact, favorite: !contact.favorite }
          : contact
      )
    );
    
    toast({
      description: "Preferências de contato atualizadas.",
    });
  };

  const addTagToConversation = (conversationId: string, tag: string) => {
    setConversations(prev => 
      prev.map(conv => {
        if (conv.id !== conversationId) return conv;
        
        const existingTags = conv.tags || [];
        if (existingTags.includes(tag)) return conv;
        
        return {
          ...conv,
          tags: [...existingTags, tag]
        };
      })
    );
  };

  const removeTagFromConversation = (conversationId: string, tag: string) => {
    setConversations(prev => 
      prev.map(conv => {
        if (conv.id !== conversationId) return conv;
        
        const existingTags = conv.tags || [];
        
        return {
          ...conv,
          tags: existingTags.filter(t => t !== tag)
        };
      })
    );
  };

  const addProtocolToConversation = async (conversationId: string, protocolId: string): Promise<void> => {
    setConversations(prev => 
      prev.map(conv => {
        if (conv.id !== conversationId) return conv;
        
        const existingProtocols = conv.protocolIds || [];
        if (existingProtocols.includes(protocolId)) return conv;
        
        return {
          ...conv,
          protocolIds: [...existingProtocols, protocolId]
        };
      })
    );
    
    toast({
      title: "Protocolo vinculado",
      description: `O protocolo ${protocolId} foi vinculado à conversa.`,
    });
    
    // Add system message about protocol linking
    const systemMessage: ChatMessage = {
      id: `msg-sys-${Date.now()}`,
      senderId: "system",
      senderName: "Sistema",
      senderType: "system",
      protocolId,
      content: `O protocolo ${protocolId} foi vinculado a esta conversa.`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), systemMessage],
    }));
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      contacts,
      activeConversationId,
      activeContactId,
      messages,
      loading,
      error,
      unreadCount,
      setActiveConversation,
      setActiveContact,
      sendMessage,
      markAsRead,
      closeConversation,
      createConversation,
      loadMoreMessages,
      addReaction,
      searchConversations,
      filterConversationsByStatus,
      toggleContactFavorite,
      addTagToConversation,
      removeTagFromConversation,
      addProtocolToConversation
    }}>
      {children}
    </ChatContext.Provider>
  );
};

// Create a custom hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
