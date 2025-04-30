
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShoppingCart, MoreHorizontal, Clock, CheckCircle, XCircle, CircleDashed, Package } from "lucide-react";
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
import { PurchaseRequest, PurchaseRequestStatus, PurchasePriority } from "@/types/administration";
import { LoadingSpinner } from "@/components/gabinete/solicitacoes/LoadingSpinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchPurchaseHistory } from "@/services/administration/purchaseService";
import { supabase } from "@/integrations/supabase/client";

interface PurchaseRequestListProps {
  requests: PurchaseRequest[];
  isLoading: boolean;
  isAdmin?: boolean;
  onUpdateStatus?: (requestId: string, status: PurchaseRequestStatus, comments?: string) => Promise<void>;
}

export function PurchaseRequestList({
  requests,
  isLoading,
  isAdmin = false,
  onUpdateStatus,
}: PurchaseRequestListProps) {
  const [selectedRequest, setSelectedRequest] = React.useState<PurchaseRequest | null>(null);
  const [history, setHistory] = React.useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [loadingDetails, setLoadingDetails] = React.useState(false);
  
  const getPriorityBadge = (priority: PurchasePriority) => {
    switch (priority) {
      case "low":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Baixa</Badge>;
      case "normal":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Normal</Badge>;
      case "high":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Alta</Badge>;
      case "urgent":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Urgente</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getStatusBadge = (status: PurchaseRequestStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "in_analysis":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Em Análise</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Aprovado</Badge>;
      case "in_process":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Em Processo</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-slate-100 text-slate-800">Concluído</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getStatusIcon = (status: PurchaseRequestStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "in_analysis":
        return <CircleDashed className="h-4 w-4 text-purple-500" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_process":
        return <CircleDashed className="h-4 w-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-slate-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const handleViewRequest = async (request: PurchaseRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
    setLoadingDetails(true);

    try {
      // Fetch status history
      const historyData = await fetchPurchaseHistory(request.id);
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
        .from("purchase_attachments")
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!requests.length) {
    return (
      <div className="text-center py-8 border rounded-lg bg-white">
        <ShoppingCart className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-2 text-lg font-medium">Nenhuma solicitação de compra encontrada</p>
        <p className="text-sm text-gray-500">
          Utilize o formulário para criar novas solicitações de compra.
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
              <TableHead>Departamento</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Enviado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.protocolNumber}</TableCell>
                <TableCell>{request.department}</TableCell>
                <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(request.status)}
                    {getStatusBadge(request.status)}
                  </div>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(request.createdAt, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
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
                            onClick={() => onUpdateStatus(request.id, "in_analysis", "Solicitação em análise")}
                          >
                            Iniciar Análise
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      {isAdmin && request.status === "in_analysis" && onUpdateStatus && (
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
                      
                      {isAdmin && request.status === "approved" && onUpdateStatus && (
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(request.id, "in_process", "Processo de compra iniciado")}
                        >
                          Iniciar Processo de Compra
                        </DropdownMenuItem>
                      )}
                      
                      {isAdmin && request.status === "in_process" && onUpdateStatus && (
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(request.id, "completed", "Processo de compra concluído")}
                        >
                          Finalizar Processo
                        </DropdownMenuItem>
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
        <DialogContent className="max-w-3xl">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Departamento</h4>
                  <p>{selectedRequest?.department}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Prioridade</h4>
                  <div>{selectedRequest && getPriorityBadge(selectedRequest.priority)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <div>{selectedRequest && getStatusBadge(selectedRequest.status)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Data da Solicitação</h4>
                  <p>{selectedRequest?.createdAt.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Justificativa</h4>
                <p className="text-gray-700">{selectedRequest?.justification}</p>
              </div>

              {selectedRequest?.items && selectedRequest.items.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Itens Solicitados</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidade</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Est.</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedRequest.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2">{item.name}</td>
                            <td className="px-3 py-2">{item.description || "-"}</td>
                            <td className="px-3 py-2">{item.quantity}</td>
                            <td className="px-3 py-2">{item.unit}</td>
                            <td className="px-3 py-2">
                              {item.estimatedPrice 
                                ? `R$ ${item.estimatedPrice.toFixed(2)}` 
                                : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedRequest?.attachments && selectedRequest.attachments.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Anexos</h4>
                  <div className="space-y-2">
                    {selectedRequest.attachments.map((attachment) => (
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
