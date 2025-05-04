
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Define types
export interface Message {
  id: string;
  text: string;
  sender: 'admin' | 'citizen' | 'system';
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  type: 'admin' | 'citizen';
  title: string;
  participantId: string;
  participantName: string;
  messages: Message[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  loading: boolean;
  sendMessage: (conversation: Conversation, text: string, sender: 'admin' | 'citizen') => Promise<void>;
  selectConversation: (id: string) => void;
  createConversation: (participantId: string, participantName: string, type: 'admin' | 'citizen') => Promise<Conversation>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Simple in-memory chat implementation
// In a real application, this would connect to Supabase or another backend
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);

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
      }
    }
  }, [user]);

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

      setActiveConversation(updatedConversation);
      setConversations((prev) =>
        prev.map((conv) => (conv.id === id ? updatedConversation : conv))
      );
    }
  };

  const sendMessage = async (conversation: Conversation, text: string, sender: 'admin' | 'citizen') => {
    setLoading(true);
    try {
      // In a real application, save the message to a database
      const newMessage: Message = {
        id: uuidv4(),
        text,
        sender,
        timestamp: new Date().toISOString(),
        read: sender === 'admin' ? false : true,
      };

      // Update the conversation
      const updatedConversation: Conversation = {
        ...conversation,
        messages: [...conversation.messages, newMessage],
        lastMessage: text,
        lastMessageTime: newMessage.timestamp,
        // If the sender is admin, increment unread count for citizen and vice versa
        unreadCount: sender === 'admin' ? conversation.unreadCount + 1 : conversation.unreadCount,
      };

      // Update conversations state
      setConversations((prev) =>
        prev.map((conv) => (conv.id === conversation.id ? updatedConversation : conv))
      );

      // Update active conversation
      if (activeConversation?.id === conversation.id) {
        setActiveConversation(updatedConversation);
      }

      // Simulate response for demo purposes
      if (sender === 'citizen') {
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
            prev.map((conv) => (conv.id === conversation.id ? respondedConversation : conv))
          );

          if (activeConversation?.id === conversation.id) {
            setActiveConversation(respondedConversation);
          }
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
    type: 'admin' | 'citizen'
  ): Promise<Conversation> => {
    // In a real application, create a conversation in your database
    const newConversation: Conversation = {
      id: uuidv4(),
      type,
      title: type === 'admin' ? 'Cidadão' : 'Atendimento',
      participantId,
      participantName,
      messages: [],
      unreadCount: 0,
    };

    setConversations((prev) => [...prev, newConversation]);
    return newConversation;
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        loading,
        sendMessage,
        selectConversation,
        createConversation,
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
