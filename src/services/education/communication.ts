
import { supabase } from "@/integrations/supabase/client";
import { handleServiceError, optimizedFetch } from "./utils/common";

export interface ParentMessage {
  id: string;
  title: string;
  content: string;
  sender_id: string;
  sender_name: string;
  recipient_ids: string[];
  recipient_type: 'parent' | 'teacher' | 'school' | 'class';
  created_at: string;
  updated_at: string;
  message_type: 'announcement' | 'notice' | 'reminder' | 'report' | 'meeting';
  read_by: string[];
  is_important: boolean;
  status: 'draft' | 'sent' | 'scheduled';
  scheduled_for?: string;
  attachment_urls?: string[];
  related_student_ids?: string[];
  school_id?: string;
  class_id?: string;
  reply_to_id?: string;
}

export const fetchMessages = async (filters?: {
  recipient_type?: string;
  message_type?: string;
  school_id?: string;
  class_id?: string;
  is_important?: boolean;
}): Promise<ParentMessage[]> => {
  try {
    // In a real implementation, this would be a proper database query with filters
    // Mock data for now
    return [
      {
        id: "1",
        title: "Reunião de Pais e Mestres",
        content: "Prezados pais e responsáveis, convidamos para a reunião que ocorrerá no próximo dia 15/05/2025 às 19h00.",
        sender_id: "teacher-1",
        sender_name: "Profa. Maria Silva",
        recipient_ids: ["parent-1", "parent-2"],
        recipient_type: "parent",
        created_at: "2025-05-01T10:00:00",
        updated_at: "2025-05-01T10:00:00",
        message_type: "meeting",
        read_by: [],
        is_important: true,
        status: "sent",
        school_id: "school-1",
        class_id: "class-1",
      },
      {
        id: "2",
        title: "Circular: Festa Junina",
        content: "Informamos que a Festa Junina acontecerá no dia 22/06/2025. Contamos com a participação de todos!",
        sender_id: "school-1",
        sender_name: "Escola Municipal João Paulo",
        recipient_ids: ["parent-1", "parent-2", "parent-3"],
        recipient_type: "parent",
        created_at: "2025-04-28T14:30:00",
        updated_at: "2025-04-28T14:30:00",
        message_type: "announcement",
        read_by: ["parent-1"],
        is_important: true,
        status: "sent",
        school_id: "school-1",
      }
    ];
  } catch (error) {
    return handleServiceError(error, 'fetching messages');
  }
};

export const fetchMessageById = async (id: string): Promise<ParentMessage | null> => {
  try {
    // Mock implementation
    const messages = await fetchMessages();
    return messages.find(message => message.id === id) || null;
  } catch (error) {
    handleServiceError(error, 'fetching message');
    return null;
  }
};

export const sendMessage = async (message: Omit<ParentMessage, 'id' | 'created_at' | 'updated_at' | 'read_by'>): Promise<ParentMessage> => {
  try {
    // Mock implementation
    const newMessage: ParentMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      read_by: [],
    };
    
    return newMessage;
  } catch (error) {
    return handleServiceError(error, 'sending message');
  }
};

export const fetchMessageRecipients = async (
  type: 'parent' | 'teacher' | 'class', 
  schoolId?: string, 
  classId?: string
): Promise<{ id: string; name: string; type: string }[]> => {
  try {
    // Mock implementation
    if (type === 'parent') {
      return [
        { id: 'parent-1', name: 'João Silva', type: 'parent' },
        { id: 'parent-2', name: 'Maria Souza', type: 'parent' },
        { id: 'parent-3', name: 'Carlos Oliveira', type: 'parent' },
      ];
    } else if (type === 'teacher') {
      return [
        { id: 'teacher-1', name: 'Profa. Ana Lucia', type: 'teacher' },
        { id: 'teacher-2', name: 'Prof. Roberto Mendes', type: 'teacher' },
      ];
    } else {
      return [
        { id: 'class-1', name: '1º Ano A', type: 'class' },
        { id: 'class-2', name: '2º Ano B', type: 'class' },
      ];
    }
  } catch (error) {
    return handleServiceError(error, 'fetching recipients');
  }
};
