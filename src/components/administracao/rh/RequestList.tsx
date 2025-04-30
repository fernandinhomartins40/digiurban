
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, MoreHorizontal, Clock, CheckCircle, XCircle, CircleDashed } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HRRequest, HRRequestStatus } from "@/types/administration";
import { LoadingSpinner } from "@/components/gabinete/solicitacoes/LoadingSpinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchRequestAttachments, fetchRequestHistory } from "@/services/administration/hr"; // Updated import path
import { supabase } from "@/integrations/supabase/client";

interface RequestListProps {
  requests: HRRequest[];
  isLoading: boolean;
  isAdmin?: boolean;
  onUpdateStatus?: (requestId: string, status: HRRequestStatus, comments?: string) => Promise<void>;
}

export function RequestList({
  requests,
  isLoading,
  isAdmin = false,
  onUpdateStatus,
}: RequestListProps) {
  const [selectedRequest, setSelectedRequest] = React.useState<HRRequest | null>(null);
  const [attachments, setAttachments] = React.useState<any[]>([]);
  const [history, setHistory] = React.useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [statusComment, setStatusComment] = React.useState("");
  const [loadingDetails, setLoadingDetails] = React.useState(false);
  
  const getStatusBadge = (status: HRRequestStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Em Progresso</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Aprovado</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getStatusIcon = (status: HRRequestStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "in_progress":
        return <CircleDashed className="h-4 w-4 text-blue-500" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const handleViewRequest = async (request: HRRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
    setLoadingDetails(true);

    try {
      // Fetch attachments
      const attachmentsData = await fetchRequestAttachments(request.id);
      setAttachments(attachmentsData);

      // Fetch status history
      const historyData = await fetchRequestHistory(request.id);
      setHistory(historyData);
    } catch (error) {
      console.error("Error fetching request details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("hr_documents")
        .download(filePath);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error: any) {
      console.error("Error downloading file:", error.message);
    }
  };

  const renderFormData = (formData: Record<string, any>) => {
    return Object.entries(formData).map(([key, value]) => (
      <div key={key} className="mb-2">
        <span className="font-medium">{key}: </span>
        <span>{value}</span>
      </div>
    ));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!requests.length) {
    return (
      <div className="text-center py-8 border rounded-lg bg-white">
        <FileText className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-2 text-lg font-medium">Nenhuma solicitação encontrada</p>
        <p className="text-sm text-gray-500">
          Utilize o formulário acima para criar novas solicitações.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Protocolo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Enviado</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.protocolNumber}</TableCell>
                <TableCell>{request.requestType?.name}</TableCell>
                <TableCell>
                  {formatDistanceToNow(request.createdAt, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(request.status)}
                    {getStatusBadge(request.status)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewRequest(request)}>
                        Ver Detalhes
                      </DropdownMenuItem>
                      
                      {isAdmin && request.status === "pending" && onUpdateStatus && (
                        <>
                          <DropdownMenuItem
                            onClick={() => onUpdateStatus(request.id, "in_progress", "Solicitação em análise")}
                          >
                            Iniciar Processamento
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onUpdateStatus(request.id, "approved", "Solicitação aprovada")}
                          >
                            Aprovar Solicitação
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onUpdateStatus(request.id, "rejected", "Solicitação rejeitada")}
                          >
                            Rejeitar Solicitação
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      {isAdmin && request.status === "in_progress" && onUpdateStatus && (
                        <>
                          <DropdownMenuItem
                            onClick={() => onUpdateStatus(request.id, "approved", "Solicitação aprovada")}
                          >
                            Aprovar Solicitação
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onUpdateStatus(request.id, "rejected", "Solicitação rejeitada")}
                          >
                            Rejeitar Solicitação
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Request Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Solicitação {selectedRequest?.protocolNumber}
            </DialogTitle>
          </DialogHeader>

          {loadingDetails ? (
            <div className="py-10">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="mt-4 space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">
                  {selectedRequest?.requestType?.name}
                </h3>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Status:</span>
                  {selectedRequest && getStatusBadge(selectedRequest.status)}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Dados da Solicitação</h4>
                {selectedRequest && renderFormData(selectedRequest.formData)}
              </div>

              {attachments.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Anexos</h4>
                  <div className="space-y-2">
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between border rounded p-2">
                        <div>
                          <span className="text-sm">{attachment.fileName}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({(attachment.fileSize / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => downloadFile(attachment.filePath, attachment.fileName)}
                        >
                          Baixar
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {history.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Histórico</h4>
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div key={item.id} className="border-l-2 border-gray-200 pl-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <span className="font-medium">
                            Status alterado para {item.status}
                          </span>
                        </div>
                        {item.comments && (
                          <p className="text-sm text-gray-600 mt-1">{item.comments}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(item.createdAt, {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
