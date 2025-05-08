
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import * as mailService from "@/services/mailService";
import { Document, Template, DocumentDestination } from "@/types/mail";
import { isAdminUser } from "@/types/auth";

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
  
  // Documents
  const getDocuments = (filters?: any) => {
    return useQuery({
      queryKey: ["documents", filters],
      queryFn: () => mailService.getDocuments(filters),
    });
  };

  // Document destinations
  const getDocumentDestinations = (documentId?: string) => {
    return useQuery({
      queryKey: ["documentDestinations", documentId],
      queryFn: () => documentId ? mailService.getDocumentDestinations(documentId) : Promise.resolve([]),
      enabled: !!documentId
    });
  };

  // Document attachments
  const getDocumentAttachments = (documentId?: string) => {
    return useQuery({
      queryKey: ["documentAttachments", documentId],
      queryFn: () => documentId ? mailService.getDocumentAttachments(documentId) : Promise.resolve([]),
      enabled: !!documentId
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
      if (!user?.id || !isAdminUser(user)) {
        throw new Error("User not authenticated or not authorized");
      }
      return mailService.forwardDocument(
        documentId, 
        isAdminUser(user) ? user.department : "", 
        toDepartment, 
        user.id
      );
    },
  });

  // Mark document as completed
  const {
    mutateAsync: markAsCompleted,
    isPending: isLoadingMarkCompleted,
  } = useMutation({
    mutationFn: (id: string) => mailService.markDocumentAsCompleted(id),
  });

  // Response to document
  const {
    mutateAsync: respondToDocument,
    isPending: isLoadingRespond,
  } = useMutation({
    mutationFn: ({ destinationId, response }: { destinationId: string; response: string }) => {
      return mailService.respondToDocument(destinationId, response);
    },
  });

  // Mark document as read
  const {
    mutateAsync: markAsRead,
    isPending: isLoadingMarkRead,
  } = useMutation({
    mutationFn: (id: string) => mailService.markDocumentAsRead(id),
  });

  // New email mutations and queries
  const {
    mutateAsync: sendInternalEmail,
    isPending: isLoadingSendEmail,
  } = useMutation({
    mutationFn: (message: {
      subject: string;
      content: string;
      to_department: string;
    }) => {
      if (!user?.id || !isAdminUser(user)) {
        throw new Error("User not authenticated or not authorized");
      }
      
      return mailService.sendInternalEmail({
        subject: message.subject,
        content: message.content,
        from_department: isAdminUser(user) ? user.department : "",
        to_department: message.to_department,
        sent_by: user.id,
      });
    }
  });

  // Get incoming documents
  const getIncomingDocuments = (departmentOverride?: string) => {
    const departmentToUse = departmentOverride || (user && isAdminUser(user) ? user.department : "");
    
    return useQuery({
      queryKey: ["incomingDocuments", departmentToUse],
      queryFn: () => departmentToUse ? mailService.getIncomingDocuments(departmentToUse) : Promise.resolve([]),
      enabled: !!departmentToUse
    });
  };

  // Get outgoing documents
  const getOutgoingDocuments = (departmentOverride?: string) => {
    const departmentToUse = departmentOverride || (user && isAdminUser(user) ? user.department : "");
    
    return useQuery({
      queryKey: ["outgoingDocuments", departmentToUse],
      queryFn: () => departmentToUse ? mailService.getOutgoingDocuments(departmentToUse) : Promise.resolve([]),
      enabled: !!departmentToUse
    });
  };

  // Get incoming emails
  const getIncomingEmails = (departmentOverride?: string) => {
    const departmentToUse = departmentOverride || (user && isAdminUser(user) ? user.department : "");
    
    return useQuery({
      queryKey: ["incomingEmails", departmentToUse],
      queryFn: () => departmentToUse ? mailService.getIncomingEmails(departmentToUse) : Promise.resolve([]),
      enabled: !!departmentToUse
    });
  };

  // Get outgoing emails
  const getOutgoingEmails = (departmentOverride?: string) => {
    const departmentToUse = departmentOverride || (user && isAdminUser(user) ? user.department : "");
    
    return useQuery({
      queryKey: ["outgoingEmails", departmentToUse],
      queryFn: () => departmentToUse ? mailService.getOutgoingEmails(departmentToUse) : Promise.resolve([]),
      enabled: !!departmentToUse
    });
  };

  // Get email details
  const getEmail = (id: string) => {
    return useQuery({
      queryKey: ["email", id],
      queryFn: () => mailService.getEmail(id),
      enabled: !!id
    });
  };

  // Get filled documents
  const {
    data: filledDocuments,
    isLoading: isLoadingFilledDocs,
    refetch: refetchFilledDocs
  } = useQuery({
    queryKey: ["filledDocuments"],
    queryFn: mailService.getFilledDocuments
  });

  // Attachment upload
  const {
    mutateAsync: uploadAttachment,
    isPending: isLoadingUpload,
  } = useMutation({
    mutationFn: ({ file, documentId }: { file: File; documentId: string }) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      return mailService.uploadAttachment(file, documentId, user.id);
    },
  });
  
  // Get attachment URL
  const getAttachmentUrl = async (filePath: string) => {
    return mailService.getAttachmentUrl(filePath);
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
    // New document functions
    getDocuments,
    getDocumentDestinations,
    getDocumentAttachments,
    markAsCompleted,
    isLoadingMarkCompleted,
    respondToDocument,
    isLoadingRespond,
    markAsRead,
    isLoadingMarkRead,
    // Email functions
    sendInternalEmail,
    isLoadingSendEmail,
    getIncomingEmails,
    getOutgoingEmails,
    getEmail,
    // Document retrieval
    getIncomingDocuments,
    getOutgoingDocuments,
    getFilledDocuments,
    filledDocuments,
    isLoadingFilledDocs,
    refetchFilledDocs,
    // Attachment functions
    uploadAttachment,
    isLoadingUpload,
    getAttachmentUrl
  };
}
