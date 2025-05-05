
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  UnifiedRequest, 
  RequestStatus, 
  PriorityLevel, 
  RequesterType,
  CreateRequestDTO 
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

export function useUnifiedRequests() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<UnifiedRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<UnifiedRequest | null>(null);
  
  // Filters
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | undefined>(undefined);
  const [requesterTypeFilter, setRequesterTypeFilter] = useState<RequesterType | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch requests with current filters
  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const data = await getUnifiedRequests(
        departmentFilter,
        statusFilter,
        requesterTypeFilter,
        searchTerm || undefined
      );
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch a specific request by ID
  const fetchRequestById = async (id: string) => {
    setIsLoading(true);
    try {
      const request = await getRequestById(id);
      setSelectedRequest(request);
      return request;
    } catch (error) {
      console.error("Error fetching request:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a new request
  const handleCreateRequest = async (requestData: CreateRequestDTO) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return null;
    }
    
    setIsLoading(true);
    try {
      const newRequest = await createUnifiedRequest({
        ...requestData,
        requester_id: user.id
      });
      
      if (newRequest) {
        // Refresh the list
        fetchRequests();
        
        toast({
          title: "Solicitação criada",
          description: "Sua solicitação foi criada com sucesso",
        });
      }
      
      return newRequest;
    } catch (error) {
      console.error("Error creating request:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a solicitação",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update request status
  const handleUpdateRequestStatus = async (requestId: string, status: RequestStatus) => {
    setIsLoading(true);
    try {
      // Fix: Pass an object with id and status properties to match UpdateRequestDTO
      const success = await updateUnifiedRequest(requestId, { 
        id: requestId, 
        status 
      });
      
      if (success) {
        // If updating the currently selected request
        if (selectedRequest && selectedRequest.id === requestId) {
          setSelectedRequest({
            ...selectedRequest,
            status,
            updated_at: new Date(),
            completed_at: status === 'completed' ? new Date() : selectedRequest.completed_at
          });
        }
        
        // Refresh the list
        fetchRequests();
        
        toast({
          title: "Status atualizado",
          description: `O status da solicitação foi atualizado para ${status}`,
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error updating request status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da solicitação",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Forward request to another department
  const handleForwardRequest = async (requestId: string, targetDepartment: string, comments?: string) => {
    setIsLoading(true);
    try {
      const success = await forwardRequestToDepartment(requestId, targetDepartment, comments);
      
      if (success) {
        // Refresh the list
        fetchRequests();
        
        // If forwarding the selected request, update its status
        if (selectedRequest && selectedRequest.id === requestId) {
          setSelectedRequest({
            ...selectedRequest,
            status: 'forwarded',
            updated_at: new Date(),
            target_department: targetDepartment,
            previous_department: selectedRequest.target_department
          });
        }
        
        toast({
          title: "Solicitação encaminhada",
          description: `A solicitação foi encaminhada para ${targetDepartment}`,
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error forwarding request:", error);
      toast({
        title: "Erro",
        description: "Não foi possível encaminhar a solicitação",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add comment to a request
  const handleAddComment = async (requestId: string, commentText: string, isInternal: boolean = false) => {
    setIsLoading(true);
    try {
      const success = await addCommentToRequest(requestId, commentText, isInternal);
      
      if (success) {
        // Refresh the selected request to get the new comment
        if (selectedRequest && selectedRequest.id === requestId) {
          await fetchRequestById(requestId);
        }
        
        toast({
          title: "Comentário adicionado",
          description: "Seu comentário foi adicionado com sucesso",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o comentário",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Upload attachment
  const handleUploadAttachment = async (requestId: string, file: File) => {
    setIsLoading(true);
    try {
      const success = await uploadRequestAttachment(requestId, file);
      
      if (success) {
        // Refresh the selected request to get the new attachment
        if (selectedRequest && selectedRequest.id === requestId) {
          await fetchRequestById(requestId);
        }
        
        toast({
          title: "Arquivo anexado",
          description: "O arquivo foi anexado com sucesso",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error uploading attachment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível anexar o arquivo",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load requests on mount or when filters change
  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user, departmentFilter, statusFilter, requesterTypeFilter, searchTerm]);
  
  return {
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
    fetchRequests,
    fetchRequestById,
    handleCreateRequest,
    handleUpdateRequestStatus,
    handleForwardRequest,
    handleAddComment,
    handleUploadAttachment
  };
}
