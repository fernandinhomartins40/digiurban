
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

// Define the interface for message reactions
export interface Reaction {
  emoji: string;
  userId: string;
  userName: string;
  type: string;
}

// Define the message interface
export interface Message {
  id: string;
  text?: string;
  content?: string;
  sender: string;
  senderId?: string;
  senderName?: string;
  timestamp: string;
  read: boolean;
  replyToId?: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  reactions?: Reaction[];
}

// Define the conversation interface
export interface Conversation {
  id: string;
  type: 'citizen' | 'admin' | 'internal';
  title: string;
  participantId: string;
  participantName: string;
  status?: string;
  messages: Message[];
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  protocolIds?: string[];
  tags?: string[];
}

// Export the type alias for components to use
export type ChatType = 'citizen' | 'admin' | 'internal';

// Define the contact interface
export interface Contact {
  id: string;
  name: string;
  type: 'admin' | 'citizen' | 'department';
  status: 'online' | 'offline' | 'away';
  departmentName?: string;
  favorite?: boolean;
  userName?: string;
}

// Export the type alias for components to use
export type ChatContact = Contact;

// Define notification interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  conversationId?: string;
}

// Define the chat settings interface
interface ChatSettings {
  theme: string;
  messageOrder: string;
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
  messages: { [key: string]: Message[] };
  contacts: Contact[];
  chatSettings: ChatSettings;
  loading: boolean;
  notifications?: Notification[];
  sendMessage: (conversationId: string, text: string, attachments?: any[], replyToId?: string) => Promise<void>;
  selectConversation: (id: string) => void;
  setActiveConversation: (id: string | null) => void;
  createConversation: (participantId: string, participantName: string, type: string) => Promise<any>;
  loadMoreMessages: (id: string) => Promise<void>;
  addTagToConversation: (id: string, tag: string) => Promise<void>;
  updateChatSettings: (settings: ChatSettings) => void;
  addProtocolToConversation: (conversationId: string, protocolId: string) => Promise<void>;
  removeProtocolFromConversation?: (conversationId: string, protocolId: string) => Promise<void>;
  markAllNotificationsAsRead?: (notificationIds: string[]) => void;
  deleteNotification?: (id: string) => void;
  clearAllNotifications?: () => void;
  replyToMessage?: (conversationId: string, messageId: string, text: string) => Promise<void>;
  addReactionToMessage?: (conversationId: string, messageId: string, reaction: string) => Promise<void>;
  removeReactionFromMessage?: (conversationId: string, messageId: string, reaction: string) => Promise<void>;
  searchMessages?: (query: string) => Promise<Message[]>;
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
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatSettings, setChatSettings] = useState<ChatSettings>(defaultChatSettings);
  const [loading, setLoading] = useState(false);

  // Get the active conversation
  const activeConversation = activeConversationId ? conversations.find(conv => conv.id === activeConversationId) || null : null;

  // Initialize demo data if needed
  useEffect(() => {
    if (user) {
      // Check if the user already has a conversation
      const existingConversation = conversations.find(conv => conv.participantId === user.id);
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
              read: false
            }
          ],
          unreadCount: 1
        };

        setConversations(prev => [...prev, newConversation]);
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
            favorite: true,
            userName: 'suporte'
          },
          {
            id: 'dept-1',
            name: 'Departamento de Saúde',
            type: 'department',
            status: 'online',
            userName: 'saude'
          },
          {
            id: 'dept-2',
            name: 'Departamento de Educação',
            type: 'department',
            status: 'online',
            userName: 'educacao'
          },
          {
            id: 'user-1',
            name: 'João Silva',
            type: 'citizen',
            status: 'offline',
            userName: 'joao.silva'
          },
          {
            id: 'user-2',
            name: 'Maria Oliveira',
            type: 'citizen',
            status: 'online',
            userName: 'maria.oliveira'
          }
        ]);
      }

      // Initialize mock notifications
      if (notifications.length === 0) {
        setNotifications([
          {
            id: uuidv4(),
            title: "Nova mensagem",
            message: "Você recebeu uma nova mensagem do suporte técnico",
            timestamp: new Date().toISOString(),
            read: false,
            conversationId: conversations[0]?.id
          }
        ]);
      }
    }
  }, [user, conversations.length, contacts.length, notifications.length]);

  const setActiveConversation = (id: string | null) => {
    setActiveConversationId(id);
    if (id && !messages[id]) {
      const conversation = conversations.find(conv => conv.id === id);
      if (conversation) {
        setMessages(prev => ({
          ...prev,
          [id]: conversation.messages
        }));
      }
    }
  };

  const selectConversation = (id: string) => {
    const conversation = conversations.find(conv => conv.id === id);
    if (conversation) {
      // Mark all messages as read when selecting a conversation
      const updatedConversation = {
        ...conversation,
        unreadCount: 0,
        messages: conversation.messages.map(msg => ({
          ...msg,
          read: true
        }))
      };

      setActiveConversation(id);
      setConversations(prev => 
        prev.map(conv => conv.id === id ? updatedConversation : conv)
      );
      setMessages(prev => ({
        ...prev,
        [id]: updatedConversation.messages
      }));
    }
  };

  const sendMessage = async (conversationId: string, text: string, attachments?: any[], replyToId?: string) => {
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
        sender: isAdminUser(user) ? 'admin' : 'citizen',
        senderId: user?.id,
        senderName: user?.name || 'User',
        timestamp: new Date().toISOString(),
        read: false,
        replyToId
      };

      // Update the conversation
      const updatedConversation = {
        ...conversation,
        messages: [...conversation.messages, newMessage],
        lastMessage: text,
        lastMessageTime: newMessage.timestamp
      };

      // Update conversations state
      setConversations(prev => 
        prev.map(conv => conv.id === conversationId ? updatedConversation : conv)
      );

      // Update messages state
      setMessages(prev => ({
        ...prev,
        [conversationId]: updatedConversation.messages
      }));

      // Simulate response for demo purposes
      if (!isAdminUser(user)) {
        setTimeout(() => {
          const responseMessage: Message = {
            id: uuidv4(),
            text: 'Obrigado por entrar em contato. Um atendente irá responder em breve.',
            sender: 'system',
            timestamp: new Date(Date.now() + 1000).toISOString(),
            read: false
          };

          const respondedConversation = {
            ...updatedConversation,
            messages: [...updatedConversation.messages, responseMessage],
            lastMessage: responseMessage.text,
            lastMessageTime: responseMessage.timestamp,
            unreadCount: updatedConversation.unreadCount + 1
          };

          setConversations(prev => 
            prev.map(conv => conv.id === conversationId ? respondedConversation : conv)
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

  const createConversation = async (participantId: string, participantName: string, type: string) => {
    // In a real application, create a conversation in your database
    const newConversation: Conversation = {
      id: uuidv4(),
      type: type as 'citizen' | 'admin' | 'internal',
      title: type === 'admin' ? 'Cidadão' : 'Atendimento',
      participantId,
      participantName,
      status: 'active',
      messages: [],
      unreadCount: 0,
    };

    setConversations(prev => [...prev, newConversation]);
    setMessages(prev => ({
      ...prev,
      [newConversation.id]: []
    }));

    return newConversation;
  };

  const loadMoreMessages = async (id: string) => {
    // In a real application, load more messages from your database
    console.log('Loading more messages for conversation', id);
    // This would fetch older messages and prepend them to the existing messages
  };

  const addTagToConversation = async (id: string, tag: string) => {
    setConversations(prev => 
      prev.map(conv => conv.id === id ? {
        ...conv,
        tags: conv.tags ? 
          [...conv.tags.filter(t => t !== tag), tag] : 
          [tag]
      } : conv)
    );
  };

  const addProtocolToConversation = async (conversationId: string, protocolId: string) => {
    setConversations(prev => 
      prev.map(conv => conv.id === conversationId ? {
        ...conv,
        protocolIds: conv.protocolIds ? 
          [...conv.protocolIds.filter(p => p !== protocolId), protocolId] : 
          [protocolId]
      } : conv)
    );
  };

  const removeProtocolFromConversation = async (conversationId: string, protocolId: string) => {
    setConversations(prev => 
      prev.map(conv => conv.id === conversationId ? {
        ...conv,
        protocolIds: conv.protocolIds ? 
          conv.protocolIds.filter(p => p !== protocolId) : 
          []
      } : conv)
    );
  };

  const updateChatSettings = (settings: ChatSettings) => {
    setChatSettings(settings);
  };

  // New function to reply to a message
  const replyToMessage = async (conversationId: string, messageId: string, text: string) => {
    return sendMessage(conversationId, text, [], messageId);
  };

  // New function to add a reaction to a message
  const addReactionToMessage = async (conversationId: string, messageId: string, reaction: string) => {
    try {
      const conversationMessages = messages[conversationId];
      if (!conversationMessages) return;

      const updatedMessages = conversationMessages.map(msg => {
        if (msg.id === messageId) {
          const newReaction: Reaction = {
            emoji: reaction,
            userId: user?.id || 'unknown',
            userName: user?.name || 'Unknown User',
            type: reaction
          };

          return {
            ...msg,
            reactions: msg.reactions ? [...msg.reactions, newReaction] : [newReaction]
          };
        }
        return msg;
      });

      // Update messages state
      setMessages(prev => ({
        ...prev,
        [conversationId]: updatedMessages
      }));
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  // New function to search messages
  const searchMessages = async (query: string): Promise<Message[]> => {
    try {
      // In a real application, search messages in your database
      let searchResults: Message[] = [];
      
      // For demo purposes, we'll search in all current messages
      Object.values(messages).forEach(conversationMessages => {
        const filteredMessages = conversationMessages.filter(msg => 
          (msg.text && msg.text.toLowerCase().includes(query.toLowerCase())) ||
          (msg.content && msg.content.toLowerCase().includes(query.toLowerCase()))
        );
        searchResults = [...searchResults, ...filteredMessages];
      });
      
      return searchResults;
    } catch (error) {
      console.error('Error searching messages:', error);
      return [];
    }
  };

  // Notification handling functions
  const markAllNotificationsAsRead = (notificationIds: string[]) => {
    setNotifications(prev => 
      prev.map(notification => 
        notificationIds.includes(notification.id) 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Helper function to check if a user is an admin
  function isAdminUser(user: any) {
    return user?.role === 'admin' || user?.role === 'prefeito';
  }

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
        notifications,
        sendMessage,
        selectConversation,
        setActiveConversation,
        createConversation,
        loadMoreMessages,
        addTagToConversation,
        updateChatSettings,
        addProtocolToConversation,
        removeProtocolFromConversation,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
        replyToMessage,
        addReactionToMessage,
        searchMessages
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

// Helper function to check if user is admin, exported for use in other components
function isAdminUser(user: any): boolean {
  return user?.role === 'admin' || user?.role === 'prefeito';
}
