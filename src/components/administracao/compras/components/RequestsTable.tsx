
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShoppingCart, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PurchaseRequest, PurchaseRequestStatus } from "@/services/administration/purchase";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { LoadingSpinner } from "@/components/gabinete/solicitacoes/LoadingSpinner";

interface RequestsTableProps {
  requests: PurchaseRequest[];
  isLoading: boolean;
  isAdmin?: boolean;
  onViewRequest: (request: PurchaseRequest) => void;
  onUpdateStatus?: (requestId: string, status: PurchaseRequestStatus, comments?: string) => Promise<void>;
}

export function RequestsTable({
  requests,
  isLoading,
  isAdmin = false,
  onViewRequest,
  onUpdateStatus,
}: RequestsTableProps) {
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
              <TableCell><PriorityBadge priority={request.priority} /></TableCell>
              <TableCell>
                <StatusBadge status={request.status} />
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
                    <DropdownMenuItem onClick={() => onViewRequest(request)}>
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
  );
}
