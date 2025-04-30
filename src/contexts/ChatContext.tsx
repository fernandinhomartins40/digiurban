
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Define types for our chat system
export type ChatType = "citizen" | "internal";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: "citizen" | "admin" | "system";
  protocolId?: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

export interface ChatConversation {
  id: string;
  title: string;
  type: ChatType;
  participants: {
    id: string;
    name: string;
    departmentId?: string;
    departmentName?: string;
    online?: boolean;
    role?: string;
  }[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  protocolId?: string;
  status: "active" | "archived" | "closed";
}

interface ChatContextType {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  messages: Record<string, ChatMessage[]>;
  loading: boolean;
  error: string | null;
  
  // Actions
  setActiveConversation: (conversationId: string | null) => void;
  sendMessage: (conversationId: string, content: string, attachments?: File[]) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  closeConversation: (conversationId: string) => Promise<void>;
  createConversation: (type: ChatType, participants: string[], title: string, protocolId?: string) => Promise<string>;
  loadMoreMessages: (conversationId: string) => Promise<void>;
}

// Create the initial context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// For demo purposes until we connect to the database
const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: "conv1",
    title: "Secretaria de Saúde",
    type: "citizen",
    participants: [
      { id: "dept1", name: "Secretaria de Saúde", departmentId: "health" },
    ],
    lastMessage: "Sua solicitação foi recebida",
    lastMessageTime: new Date().toISOString(),
    unreadCount: 2,
    protocolId: "2025-000123",
    status: "active",
  },
  {
    id: "conv2",
    title: "Ouvidoria Municipal",
    type: "citizen",
    participants: [
      { id: "dept2", name: "Ouvidoria Municipal", departmentId: "ombudsman" },
    ],
    lastMessage: "Protocolo #12345 aberto",
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    protocolId: "2025-000124",
    status: "active",
  },
  {
    id: "conv3",
    title: "Suporte Técnico",
    type: "internal",
    participants: [
      { id: "user1", name: "Maria Silva", departmentId: "tech", departmentName: "TI" },
      { id: "user2", name: "João Santos", departmentId: "finance", departmentName: "Finanças" },
    ],
    lastMessage: "Você pode verificar o problema com o sistema?",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unreadCount: 1,
    status: "active",
  }
];

// Mock messages for demo
const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  "conv1": [
    {
      id: "m1",
      senderId: "dept1",
      senderName: "Secretaria de Saúde",
      senderType: "admin",
      protocolId: "2025-000123",
      content: "Olá! Como posso ajudar com sua solicitação?",
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "m2",
      senderId: "user",
      senderName: "Você",
      senderType: "citizen",
      protocolId: "2025-000123",
      content: "Gostaria de informações sobre agendamento de consultas",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "m3",
      senderId: "dept1",
      senderName: "Secretaria de Saúde",
      senderType: "admin",
      protocolId: "2025-000123",
      content: "Claro! Para agendar uma consulta, você precisa...",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: false,
    }
  ]
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, userType } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load conversations based on user type
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // In a real implementation, we would fetch from the database here
    setLoading(true);
    
    // Load different conversations based on user type
    const loadedConversations = MOCK_CONVERSATIONS.filter(conv => {
      if (userType === "citizen") {
        return conv.type === "citizen";
      } else {
        // Admin can see both types of conversations based on their department
        return true;
      }
    });

    setConversations(loadedConversations);
    setMessages(MOCK_MESSAGES);
    setLoading(false);
  }, [isAuthenticated, user, userType]);

  const setActiveConversation = (conversationId: string | null) => {
    setActiveConversationId(conversationId);
    if (conversationId && messages[conversationId]) {
      markAsRead(conversationId);
    }
  };

  const sendMessage = async (conversationId: string, content: string, attachments?: File[]) => {
    if (!user || !conversationId) return;
    
    // In a real implementation, we'd send to the database here
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderType: userType === "citizen" ? "citizen" : "admin",
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // If there are attachments, process them (would upload to storage in real implementation)
    if (attachments?.length) {
      newMessage.attachments = attachments.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file), // Just for demo
        type: file.type,
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
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
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
    
    if (activeConversationId === conversationId) {
      setActiveConversationId(null);
    }
  };

  const createConversation = async (
    type: ChatType, 
    participants: string[], 
    title: string, 
    protocolId?: string
  ): Promise<string> => {
    // In real implementation, create the conversation in the database
    const newConversation: ChatConversation = {
      id: `conv-${Date.now()}`,
      title,
      type,
      participants: participants.map(id => ({ id, name: `Participant ${id}` })),
      unreadCount: 0,
      protocolId,
      status: "active",
    };

    setConversations(prev => [...prev, newConversation]);
    return newConversation.id;
  };

  const loadMoreMessages = async (conversationId: string) => {
    // In real implementation, load more messages from the database
    // For now just show a log
    console.log(`Loading more messages for conversation ${conversationId}`);
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConversationId,
      messages,
      loading,
      error,
      setActiveConversation,
      sendMessage,
      markAsRead,
      closeConversation,
      createConversation,
      loadMoreMessages,
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
