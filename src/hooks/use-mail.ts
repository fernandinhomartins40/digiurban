
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import * as mailService from "@/services/mailService";
import { Document, Template } from "@/types/mail";
import { useApiQuery } from "@/lib/hooks/useApiQuery";
import { useApiMutation } from "@/lib/hooks/useApiMutation";
import { api } from "@/lib/api/supabaseClient";

export function useMail() {
  const { user } = useAuth();
  
  // Document types
  const documentTypes = useQuery({
    queryKey: ["documentTypes"],
    queryFn: mailService.getDocumentTypes,
  });

  // Templates
  const getTemplates = (departmentId?: string) => {
    return useQuery({
      queryKey: ["templates", departmentId],
      queryFn: () => mailService.getTemplates(departmentId),
    });
  };

  const getTemplate = (id?: string) => {
    return useQuery({
      queryKey: ["template", id],
      queryFn: () => (id ? mailService.getTemplate(id) : Promise.resolve(null)),
      enabled: !!id,
    });
  };
  
  // Create document mutation
  const {
    mutateAsync: createDocument,
    isPending: isLoadingCreate,
  } = useMutation({
    mutationFn: (data: Partial<Document>) => mailService.createDocument(data),
  });
  
  // Create filled template mutation
  const {
    mutateAsync: createFilledTemplate,
    isPending: isLoadingCreateFilled,
  } = useMutation({
    mutationFn: (data: Partial<Document>) => mailService.createFilledTemplate(data),
  });
  
  // Forward document mutation
  const {
    mutateAsync: forwardDocument,
    isPending: isLoadingForward,
  } = useMutation({
    mutationFn: ({ documentId, toDepartment }: { documentId: string; toDepartment: string }) => {
      if (!user?.id || !user?.department) {
        throw new Error("User not authenticated or department not set");
      }
      return mailService.forwardDocument(documentId, user.department, toDepartment, user.id);
    },
  });

  // New email mutations and queries
  const sendInternalEmail = async (message: {
    subject: string;
    content: string;
    to_department: string;
  }) => {
    if (!user?.id || !user?.department) {
      throw new Error("User not authenticated or department not set");
    }
    
    return mailService.sendInternalEmail({
      subject: message.subject,
      content: message.content,
      from_department: user.department,
      to_department: message.to_department,
      sent_by: user.id,
    });
  };

  const getIncomingEmails = async (department?: string) => {
    if (!department && !user?.department) {
      throw new Error("Department not specified");
    }
    return mailService.getIncomingEmails(department || user.department);
  };

  const getOutgoingEmails = async (department?: string) => {
    if (!department && !user?.department) {
      throw new Error("Department not specified");
    }
    return mailService.getOutgoingEmails(department || user.department);
  };

  const markEmailAsRead = (id: string) => {
    return mailService.markEmailAsRead(id);
  };

  const getEmail = (id: string) => {
    return mailService.getEmail(id);
  };

  const getFilledDocuments = () => {
    return mailService.getFilledDocuments();
  };
  
  // Return all functions
  return {
    documentTypes,
    getTemplates,
    getTemplate,
    createDocument,
    createFilledTemplate,
    forwardDocument,
    isLoadingCreate,
    isLoadingCreateFilled,
    isLoadingForward,
    // New email functions
    sendInternalEmail,
    getIncomingEmails,
    getOutgoingEmails,
    markEmailAsRead,
    getEmail,
    getFilledDocuments
  };
}
