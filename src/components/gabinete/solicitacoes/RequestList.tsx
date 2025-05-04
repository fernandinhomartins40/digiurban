
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
import { DirectRequest, RequestStatus } from "@/types/mayorOffice";
import { EmptyRequests } from "./EmptyRequests";
import { LoadingSpinner } from "./LoadingSpinner";

interface RequestListProps {
  requests: DirectRequest[] | undefined;
  isLoading: boolean;
  searchQuery: string;
  handleStatusChange: (requestId: string, status: RequestStatus) => Promise<void>;
  onRequestClick?: (request: DirectRequest) => void;
}

export function RequestList({
  requests,
  isLoading,
  searchQuery,
  handleStatusChange,
  onRequestClick,
}: RequestListProps) {
  const formatDate = (date: string | undefined) => {
    if (!date) return "Não definida";
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return date;
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "open":
        return <Badge variant="secondary">Aberto</Badge>;
      case "in_progress":
        return <Badge variant="default">Em Andamento</Badge>;
      case "completed":
        return <Badge variant="outline">Concluído</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <Badge variant="outline">Baixa</Badge>;
      case "normal":
        return <Badge variant="outline">Normal</Badge>;
      case "high":
        return <Badge variant="secondary">Alta</Badge>;
      case "urgent":
        return <Badge variant="destructive">Urgente</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Filter requests by search query
  const filteredRequests = requests?.filter((request) =>
    request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.requesterName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.targetDepartment?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!filteredRequests || filteredRequests.length === 0) {
    return <EmptyRequests searchQuery={searchQuery} />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Protocolo</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-mono text-xs">
                {request.protocolNumber}
              </TableCell>
              <TableCell className="font-medium max-w-xs truncate">
                {request.title}
              </TableCell>
              <TableCell>{request.targetDepartment}</TableCell>
              <TableCell>{formatDate(request.dueDate?.toString())}</TableCell>
              <TableCell>{getPriorityBadge(request.priority)}</TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRequestClick?.(request)}
                >
                  Detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
