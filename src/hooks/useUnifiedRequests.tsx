import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { 
  UnifiedRequest, 
  CreateRequestDTO, 
  RequestStatus,
  RequesterType,
  PriorityLevel,
  UpdateRequestDTO
} from "@/types/requests";
import { 
  getUnifiedRequests, 
  getRequestById, 
  createUnifiedRequest,
  updateUnifiedRequest,
  forwardRequestToDepartment,
  addCommentToRequest,
  uploadRequestAttachment
} from "@/services/requestsService";
import { mapStatusName } from "@/utils/requestMappers";

export const useUnifiedRequests = () => {
  const queryClient = useQueryClient();
  
  // Filters
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<RequestStatus | undefined>();
  const [requesterTypeFilter, setRequesterTypeFilter] = useState<RequesterType | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Selected request
  const [selectedRequest, setSelectedRequest] = useState<UnifiedRequest | null>(null);
  
  // Fetch requests with filters
  const { 
    data: requests,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['unified-requests', departmentFilter, statusFilter, requesterTypeFilter, searchTerm],
    queryFn: () => getUnifiedRequests(
      departmentFilter,
      statusFilter,
      requesterTypeFilter,
      searchTerm || undefined
    )
  });
  
  // Fetch a single request by ID
  const fetchRequestById = useCallback(async (id: string) => {
    try {
      const request = await getRequestById(id);
      if (request) {
        setSelectedRequest(request);
        return request;
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os detalhes da solicitação',
        variant: 'destructive'
      });
    }
    return null;
  }, []);
  
  // Create a new request
  const handleCreateRequest = useCallback(async (data: CreateRequestDTO) => {
    try {
      const result = await createUnifiedRequest({
        ...data,
        requester_type: data.requester_type,
        requester_id: data.requester_id
      });
      
      if (result) {
        toast({
          title: 'Solicitação criada',
          description: 'Sua solicitação foi criada com sucesso',
        });
        
        // Refresh the requests list
        refetch();
        return true;
      }
    } catch (error) {
      console.error('Error creating request:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a solicitação',
        variant: 'destructive'
      });
    }
    return false;
  }, [refetch]);
  
  // Update request status
  const handleUpdateRequestStatus = useCallback(async (id: string, status: RequestStatus) => {
    try {
      const result = await updateUnifiedRequest(id, { 
        id, // Add the id to match the UpdateRequestDTO type
        status 
      });
      
      if (result) {
        toast({
          title: 'Status atualizado',
          description: `Status alterado para "${mapStatusName(status)}"`,
        });
        
        // Refresh the requests list and selected request
        refetch();
        if (selectedRequest?.id === id) {
          fetchRequestById(id);
        }
        return true;
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status',
        variant: 'destructive'
      });
    }
    return false;
  }, [refetch, fetchRequestById, selectedRequest]);
  
  // Forward request to another department
  const handleForwardRequest = useCallback(async (id: string, targetDepartment: string, comments?: string) => {
    try {
      const result = await forwardRequestToDepartment(id, targetDepartment, comments);
      
      if (result) {
        toast({
          title: 'Solicitação encaminhada',
          description: `Encaminhada para ${targetDepartment}`,
        });
        
        // Refresh the requests list
        refetch();
        return true;
      }
    } catch (error) {
      console.error('Error forwarding request:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível encaminhar a solicitação',
        variant: 'destructive'
      });
    }
    return false;
  }, [refetch]);
  
  // Add comment to request
  const handleAddComment = useCallback(async (id: string, comment: string, isInternal: boolean = false) => {
    try {
      const result = await addCommentToRequest(id, comment, isInternal);
      
      if (result) {
        toast({
          title: 'Comentário adicionado',
          description: 'Seu comentário foi adicionado com sucesso',
        });
        
        // Refresh the selected request to show the new comment
        if (selectedRequest?.id === id) {
          fetchRequestById(id);
        }
        return true;
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o comentário',
        variant: 'destructive'
      });
    }
    return false;
  }, [fetchRequestById, selectedRequest]);
  
  // Upload attachment to request
  const handleUploadAttachment = useCallback(async (id: string, file: File) => {
    try {
      const result = await uploadRequestAttachment(id, file);
      
      if (result) {
        toast({
          title: 'Arquivo anexado',
          description: 'Seu arquivo foi anexado com sucesso',
        });
        
        // Refresh the selected request to show the new attachment
        if (selectedRequest?.id === id) {
          fetchRequestById(id);
        }
        return true;
      }
    } catch (error) {
      console.error('Error uploading attachment:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível anexar o arquivo',
        variant: 'destructive'
      });
    }
    return false;
  }, [fetchRequestById, selectedRequest]);
  
  return {
    // Data
    requests,
    isLoading,
    selectedRequest,
    setSelectedRequest,
    
    // Filters
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    requesterTypeFilter,
    setRequesterTypeFilter,
    searchTerm,
    setSearchTerm,
    
    // Actions
    fetchRequestById,
    handleCreateRequest,
    handleUpdateRequestStatus,
    handleForwardRequest,
    handleAddComment,
    handleUploadAttachment,
    
    // Refresh
    refetch
  };
};
