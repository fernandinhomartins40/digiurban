
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Define types
export interface Message {
  id: string;
  text: string;
  content?: string;
  sender: 'admin' | 'citizen' | 'system';
  senderId?: string;
  senderName?: string;
  timestamp: string;
  read: boolean;
  replyToId?: string;
  attachments?: any[];
}

export interface Conversation {
  id: string;
  type: 'admin' | 'citizen' | 'internal';
  title: string;
  participantId: string;
  participantName: string;
  messages: Message[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  status?: 'active' | 'closed' | 'archived';
  contactId?: string;
  protocolIds?: string[];
  participants?: { id: string; name: string; }[];
  tags?: string[];
}

export interface ChatContact {
  id: string;
  name: string;
  type: 'admin' | 'citizen' | 'department';
  status: 'online' | 'away' | 'offline';
  departmentName?: string;
  favorite?: boolean;
}

interface ChatSettings {
  theme: 'sistema' | 'claro' | 'escuro';
  messageOrder: 'newest' | 'oldest';
  showTypingIndicator: boolean;
  enableAutocomplete: boolean;
  spellCheck: boolean;
  browserNotifications: boolean;
  notificationSounds: boolean;
  notificationVolume: number;
  sendReadReceipts: boolean;
  showOnlineStatus: boolean;
  messageHistory: string;
}

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  contacts: ChatContact[];
  chatSettings: ChatSettings;
  loading: boolean;
  sendMessage: (conversationId: string, text: string, attachments?: File[], replyToId?: string) => Promise<void>;
  selectConversation: (id: string) => void;
  setActiveConversation: (id: string | null) => void;
  createConversation: (participantId: string, participantName: string, type: 'admin' | 'citizen' | 'internal') => Promise<Conversation>;
  closeConversation: (id: string) => Promise<void>;
  loadMoreMessages: (id: string) => Promise<void>;
  addTagToConversation: (id: string, tag: string) => Promise<void>;
  updateChatSettings: (settings: ChatSettings) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const defaultChatSettings: ChatSettings = {
  theme: 'sistema',
  messageOrder: 'newest',
  showTypingIndicator: true,
  enableAutocomplete: true,
  spellCheck: true,
  browserNotifications: true,
  notificationSounds: true,
  notificationVolume: 70,
  sendReadReceipts: true,
  showOnlineStatus: true,
  messageHistory: 'forever'
};

// Implementation of the ChatContext provider
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [chatSettings, setChatSettings] = useState<ChatSettings>(defaultChatSettings);
  const [loading, setLoading] = useState(false);

  // Get the active conversation
  const activeConversation = activeConversationId ? 
    conversations.find(conv => conv.id === activeConversationId) || null : null;

  // Initialize demo data if needed
  useEffect(() => {
    if (user) {
      // Check if the user already has a conversation
      const existingConversation = conversations.find(
        (conv) => conv.participantId === user.id
      );

      if (!existingConversation) {
        // Create a mock conversation for the user
        const newConversation: Conversation = {
          id: uuidv4(),
          type: 'citizen',
          title: 'Atendimento',
          participantId: user.id,
          participantName: user.name || 'Cidadão',
          status: 'active',
          messages: [
            {
              id: uuidv4(),
              text: 'Olá! Como posso ajudar você hoje?',
              sender: 'admin',
              timestamp: new Date().toISOString(),
              read: false,
            },
          ],
          unreadCount: 1,
        };

        setConversations((prev) => [...prev, newConversation]);
        setMessages(prev => ({
          ...prev,
          [newConversation.id]: newConversation.messages
        }));
      }
      
      // Initialize mock contacts
      if (contacts.length === 0) {
        setContacts([
          {
            id: 'admin-1',
            name: 'Suporte Técnico',
            type: 'admin',
            status: 'online',
            departmentName: 'Tecnologia',
            favorite: true
          },
          {
            id: 'dept-1',
            name: 'Departamento de Saúde',
            type: 'department',
            status: 'online'
          },
          {
            id: 'dept-2',
            name: 'Departamento de Educação',
            type: 'department',
            status: 'online'
          }
        ]);
      }
    }
  }, [user, conversations.length, contacts.length]);

  const setActiveConversation = (id: string | null) => {
    setActiveConversationId(id);
    if (id && !messages[id]) {
      const conversation = conversations.find(conv => conv.id === id);
      if (conversation) {
        setMessages(prev => ({...prev, [id]: conversation.messages}));
      }
    }
  };

  const selectConversation = (id: string) => {
    const conversation = conversations.find((conv) => conv.id === id);
    if (conversation) {
      // Mark all messages as read when selecting a conversation
      const updatedConversation = {
        ...conversation,
        unreadCount: 0,
        messages: conversation.messages.map((msg) => ({
          ...msg,
          read: true,
        })),
      };

      setActiveConversation(id);
      setConversations((prev) =>
        prev.map((conv) => (conv.id === id ? updatedConversation : conv))
      );
      setMessages(prev => ({
        ...prev,
        [id]: updatedConversation.messages
      }));
    }
  };

  const sendMessage = async (conversationId: string, text: string, attachments?: File[], replyToId?: string) => {
    setLoading(true);
    try {
      const conversation = conversations.find(conv => conv.id === conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      // In a real application, save the message to a database
      const newMessage: Message = {
        id: uuidv4(),
        text,
        sender: user?.userType === 'admin' ? 'admin' : 'citizen',
        senderId: user?.id,
        senderName: user?.name || 'User',
        timestamp: new Date().toISOString(),
        read: false,
        replyToId,
      };

      // Update the conversation
      const updatedConversation: Conversation = {
        ...conversation,
        messages: [...conversation.messages, newMessage],
        lastMessage: text,
        lastMessageTime: newMessage.timestamp,
      };

      // Update conversations state
      setConversations((prev) =>
        prev.map((conv) => (conv.id === conversationId ? updatedConversation : conv))
      );

      // Update messages state
      setMessages(prev => ({
        ...prev,
        [conversationId]: updatedConversation.messages
      }));

      // Simulate response for demo purposes
      if (user?.userType !== 'admin') {
        setTimeout(() => {
          const responseMessage: Message = {
            id: uuidv4(),
            text: 'Obrigado por entrar em contato. Um atendente irá responder em breve.',
            sender: 'system',
            timestamp: new Date(Date.now() + 1000).toISOString(),
            read: false,
          };

          const respondedConversation: Conversation = {
            ...updatedConversation,
            messages: [...updatedConversation.messages, responseMessage],
            lastMessage: responseMessage.text,
            lastMessageTime: responseMessage.timestamp,
            unreadCount: updatedConversation.unreadCount + 1,
          };

          setConversations((prev) =>
            prev.map((conv) => (conv.id === conversationId ? respondedConversation : conv))
          );

          setMessages(prev => ({
            ...prev,
            [conversationId]: respondedConversation.messages
          }));
        }, 1000);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (
    participantId: string,
    participantName: string,
    type: 'admin' | 'citizen' | 'internal'
  ): Promise<Conversation> => {
    // In a real application, create a conversation in your database
    const newConversation: Conversation = {
      id: uuidv4(),
      type,
      title: type === 'admin' ? 'Cidadão' : 'Atendimento',
      participantId,
      participantName,
      status: 'active',
      messages: [],
      unreadCount: 0,
      participants: [
        { id: user?.id || '', name: user?.name || 'Usuário' },
        { id: participantId, name: participantName }
      ]
    };

    setConversations((prev) => [...prev, newConversation]);
    setMessages(prev => ({...prev, [newConversation.id]: []}));
    return newConversation;
  };

  const closeConversation = async (id: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id 
          ? {...conv, status: 'closed'} 
          : conv
      )
    );
  };

  const loadMoreMessages = async (id: string) => {
    // In a real application, load more messages from your database
    console.log('Loading more messages for conversation', id);
    // This would fetch older messages and prepend them to the existing messages
  };

  const addTagToConversation = async (id: string, tag: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id 
          ? {
              ...conv, 
              tags: conv.tags ? [...conv.tags.filter(t => t !== tag), tag] : [tag]
            } 
          : conv
      )
    );
  };

  const updateChatSettings = (settings: ChatSettings) => {
    setChatSettings(settings);
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        activeConversationId,
        messages,
        contacts,
        chatSettings,
        loading,
        sendMessage,
        selectConversation,
        setActiveConversation,
        createConversation,
        closeConversation,
        loadMoreMessages,
        addTagToConversation,
        updateChatSettings,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
