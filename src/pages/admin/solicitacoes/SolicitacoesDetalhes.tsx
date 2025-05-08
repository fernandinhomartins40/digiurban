
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUnifiedRequests } from "@/hooks/useUnifiedRequests";
import { UnifiedRequest, RequestStatus } from "@/types/requests";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, Building, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RequestDetailDrawer } from "@/components/unified-requests/RequestDetailDrawer";
import { mapStatusName, mapPriorityName, getStatusColor, getPriorityColor } from "@/utils/requestMappers";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function SolicitacoesDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "prefeito";
  
  const {
    fetchRequestById,
    selectedRequest,
    setSelectedRequest,
    handleUpdateRequestStatus,
    handleForwardRequest,
    handleAddComment,
    handleUploadAttachment,
  } = useUnifiedRequests();
  
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchRequestById(id).finally(() => {
        setIsLoading(false);
      });
    }

    return () => {
      setSelectedRequest(null);
    };
  }, [id, fetchRequestById, setSelectedRequest]);
  
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "Não definida";
    try {
      return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };
  
  // List of available departments for forwarding
  const departments = [
    "Gabinete do Prefeito",
    "Administração",
    "Finanças",
    "Obras",
    "Saúde",
    "Educação",
    "Assistência Social",
    "Meio Ambiente",
    "Serviços Urbanos",
  ];
  
  const handleBackClick = () => {
    navigate("/admin/solicitacoes");
  };
  
  const openDetailDrawer = () => {
    setIsDetailDrawerOpen(true);
  };
  
  const handleCloseDetailDrawer = () => {
    setIsDetailDrawerOpen(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!selectedRequest) {
    return (
      <div className="container mx-auto p-8">
        <Button variant="outline" onClick={handleBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <div className="mt-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">Solicitação não encontrada</h2>
          <p className="mt-2 text-muted-foreground">
            A solicitação que você está procurando não existe ou foi removida.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Solicitações
        </Button>
        <Button onClick={openDetailDrawer}>
          Ver Detalhes Completos
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{selectedRequest.title}</CardTitle>
              <CardDescription>
                Protocolo: {selectedRequest.protocol_number}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(selectedRequest.status as RequestStatus)}>
                {mapStatusName(selectedRequest.status as RequestStatus)}
              </Badge>
              <Badge className={getPriorityColor(selectedRequest.priority as any)}>
                {mapPriorityName(selectedRequest.priority as any)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Detalhes da Solicitação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Criado em:</strong> {formatDate(selectedRequest.created_at)}
                </span>
              </div>
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Departamento:</strong> {selectedRequest.target_department}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Data Limite:</strong> {formatDate(selectedRequest.due_date)}
                </span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Tipo de Solicitante:</strong> {selectedRequest.requester_type === 'citizen' ? 'Cidadão' : 
                                                        selectedRequest.requester_type === 'department' ? 'Departamento' : 'Gabinete'}
                </span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-2">Descrição</h3>
            <p className="text-sm">{selectedRequest.description}</p>
          </div>
        </CardContent>
      </Card>
      
      <RequestDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={handleCloseDetailDrawer}
        request={selectedRequest}
        onUpdateStatus={handleUpdateRequestStatus}
        onForward={isAdmin ? handleForwardRequest : undefined}
        onAddComment={handleAddComment}
        onUploadAttachment={handleUploadAttachment}
        departments={departments}
      />
    </div>
  );
}
