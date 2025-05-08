
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UnifiedRequest } from "@/types/requests";
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
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyRequests } from "./EmptyRequests";
import { 
  getStatusColor, 
  getPriorityColor, 
  mapStatusName, 
  mapPriorityName,
  getRequesterTypeName
} from "@/utils/requestMappers";

interface RequestListProps {
  requests: UnifiedRequest[] | undefined;
  isLoading: boolean;
  onRequestClick?: (request: UnifiedRequest) => void;
}

export function RequestList({
  requests,
  isLoading,
  onRequestClick,
}: RequestListProps) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!requests || requests.length === 0) {
    return <EmptyRequests />;
  }

  const formatDate = (date: string | Date) => {
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Protocolo</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Origem</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-mono text-xs">
                {request.protocol_number}
              </TableCell>
              <TableCell className="font-medium max-w-xs truncate">
                {request.title}
              </TableCell>
              <TableCell>
                {getRequesterTypeName(request.requester_type)}
              </TableCell>
              <TableCell>{request.target_department}</TableCell>
              <TableCell>
                <Badge className={getPriorityColor(request.priority)}>
                  {mapPriorityName(request.priority)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(request.status)}>
                  {mapStatusName(request.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDate(request.created_at)}
              </TableCell>
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
