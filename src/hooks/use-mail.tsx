
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import * as mailService from "@/services/mailService";
import { Document, DocumentAttachment, DocumentDestination, DocumentFilters, DocumentStatus, DocumentType, Template, TemplateField } from "@/types/mail";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useMail() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Document Types
  const documentTypes = useQuery({
    queryKey: ['documentTypes'],
    queryFn: () => mailService.getDocumentTypes(),
  });
  
  // Documents
  const getDocuments = (filters?: DocumentFilters) => 
    useQuery({
      queryKey: ['documents', filters],
      queryFn: () => mailService.getDocuments(filters),
    });
  
  const getDocument = (id?: string) => 
    useQuery({
      queryKey: ['document', id],
      queryFn: () => mailService.getDocument(id!),
      enabled: !!id,
    });
  
  const createDocumentMutation = useMutation({
    mutationFn: (document: Partial<Document>) => mailService.createDocument(document),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: "Documento criado",
        description: "O documento foi criado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar documento",
        description: "Ocorreu um erro ao criar o documento.",
        variant: "destructive",
      });
      console.error(error);
    }
  });
  
  const updateDocumentStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: DocumentStatus }) => 
      mailService.updateDocumentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: "Status atualizado",
        description: "O status do documento foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao atualizar o status do documento.",
        variant: "destructive",
      });
      console.error(error);
    }
  });
  
  // Document Destinations
  const getDocumentDestinations = (documentId?: string) =>
    useQuery({
      queryKey: ['documentDestinations', documentId],
      queryFn: () => mailService.getDocumentDestinations(documentId!),
      enabled: !!documentId,
    });
  
  const getIncomingDocuments = () =>
    useQuery({
      queryKey: ['incomingDocuments', user?.department],
      queryFn: () => mailService.getIncomingDocuments(user?.department!),
      enabled: !!user?.department,
    });
  
  const getOutgoingDocuments = () =>
    useQuery({
      queryKey: ['outgoingDocuments', user?.department],
      queryFn: () => mailService.getOutgoingDocuments(user?.department!),
      enabled: !!user?.department,
    });
  
  const forwardDocumentMutation = useMutation({
    mutationFn: ({ documentId, toDepartment }: { documentId: string; toDepartment: string }) =>
      mailService.forwardDocument(documentId, user?.department!, toDepartment, user?.id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['documentDestinations'] });
      queryClient.invalidateQueries({ queryKey: ['incomingDocuments'] });
      queryClient.invalidateQueries({ queryKey: ['outgoingDocuments'] });
      toast({
        title: "Documento encaminhado",
        description: "O documento foi encaminhado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao encaminhar documento",
        description: "Ocorreu um erro ao encaminhar o documento.",
        variant: "destructive",
      });
      console.error(error);
    }
  });
  
  const markAsReadMutation = useMutation({
    mutationFn: (destinationId: string) => mailService.markDocumentAsRead(destinationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomingDocuments'] });
    },
    onError: (error) => {
      console.error(error);
    }
  });
  
  const respondToDocumentMutation = useMutation({
    mutationFn: ({ destinationId, response }: { destinationId: string; response: string }) =>
      mailService.respondToDocument(destinationId, response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentDestinations'] });
      queryClient.invalidateQueries({ queryKey: ['incomingDocuments'] });
      toast({
        title: "Resposta enviada",
        description: "Sua resposta foi enviada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar resposta",
        description: "Ocorreu um erro ao enviar sua resposta.",
        variant: "destructive",
      });
      console.error(error);
    }
  });
  
  const markAsCompletedMutation = useMutation({
    mutationFn: (id: string) => mailService.markDocumentAsCompleted(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['incomingDocuments'] });
      toast({
        title: "Documento concluído",
        description: "O documento foi marcado como concluído com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao marcar documento como concluído",
        description: "Ocorreu um erro ao marcar o documento como concluído.",
        variant: "destructive",
      });
      console.error(error);
    }
  });
  
  // Attachments
  const getDocumentAttachments = (documentId?: string) =>
    useQuery({
      queryKey: ['documentAttachments', documentId],
      queryFn: () => mailService.getDocumentAttachments(documentId!),
      enabled: !!documentId,
    });
  
  const uploadAttachmentMutation = useMutation({
    mutationFn: ({ file, documentId }: { file: File; documentId: string }) =>
      mailService.uploadAttachment(file, documentId, user?.id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentAttachments'] });
      toast({
        title: "Arquivo anexado",
        description: "O arquivo foi anexado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao anexar arquivo",
        description: "Ocorreu um erro ao anexar o arquivo.",
        variant: "destructive",
      });
      console.error(error);
    }
  });
  
  // Templates
  const getTemplates = () =>
    useQuery({
      queryKey: ['templates', user?.department],
      queryFn: () => mailService.getTemplates(user?.department),
    });
  
  const getTemplate = (id?: string) =>
    useQuery({
      queryKey: ['template', id],
      queryFn: () => mailService.getTemplate(id!),
      enabled: !!id,
    });
  
  const createTemplateMutation = useMutation({
    mutationFn: ({ template, fields }: { template: Partial<Template>, fields: Partial<TemplateField>[] }) =>
      mailService.createTemplate({...template, creator_id: user?.id!}, fields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: "Modelo criado",
        description: "O modelo foi criado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar modelo",
        description: "Ocorreu um erro ao criar o modelo.",
        variant: "destructive",
      });
      console.error(error);
    }
  });
  
  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, template, fields }: { id: string, template: Partial<Template>, fields: Partial<TemplateField>[] }) =>
      mailService.updateTemplate(id, template, fields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: "Modelo atualizado",
        description: "O modelo foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar modelo",
        description: "Ocorreu um erro ao atualizar o modelo.",
        variant: "destructive",
      });
      console.error(error);
    }
  });
  
  const deleteTemplateMutation = useMutation({
    mutationFn: (id: string) => mailService.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: "Modelo removido",
        description: "O modelo foi removido com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover modelo",
        description: "Ocorreu um erro ao remover o modelo.",
        variant: "destructive",
      });
      console.error(error);
    }
  });
  
  return {
    // Document Types
    documentTypes,
    
    // Documents
    getDocuments,
    getDocument,
    createDocument: createDocumentMutation.mutate,
    updateDocumentStatus: updateDocumentStatusMutation.mutate,
    
    // Document Destinations
    getDocumentDestinations,
    getIncomingDocuments,
    getOutgoingDocuments,
    forwardDocument: forwardDocumentMutation.mutate,
    markAsRead: markAsReadMutation.mutate,
    respondToDocument: respondToDocumentMutation.mutate,
    markAsCompleted: markAsCompletedMutation.mutate,
    
    // Attachments
    getDocumentAttachments,
    uploadAttachment: uploadAttachmentMutation.mutate,
    getAttachmentUrl: mailService.getAttachmentUrl,
    
    // Templates
    getTemplates,
    getTemplate,
    createTemplate: createTemplateMutation.mutate,
    updateTemplate: updateTemplateMutation.mutate,
    deleteTemplate: deleteTemplateMutation.mutate,
    
    // Loading states
    isLoadingCreate: createDocumentMutation.isPending,
    isLoadingUpdateStatus: updateDocumentStatusMutation.isPending,
    isLoadingForward: forwardDocumentMutation.isPending,
    isLoadingRespond: respondToDocumentMutation.isPending,
    isLoadingMarkCompleted: markAsCompletedMutation.isPending,
    isLoadingUpload: uploadAttachmentMutation.isPending,
    isLoadingCreateTemplate: createTemplateMutation.isPending,
    isLoadingUpdateTemplate: updateTemplateMutation.isPending,
    isLoadingDeleteTemplate: deleteTemplateMutation.isPending,
  };
}
