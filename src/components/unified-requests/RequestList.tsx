
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
  getStatusName, 
  getPriorityName,
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
                {request.protocolNumber}
              </TableCell>
              <TableCell className="font-medium max-w-xs truncate">
                {request.title}
              </TableCell>
              <TableCell>
                {getRequesterTypeName(request.requesterType)}
              </TableCell>
              <TableCell>{request.targetDepartment}</TableCell>
              <TableCell>
                <Badge className={getPriorityColor(request.priority)}>
                  {getPriorityName(request.priority)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(request.status)}>
                  {getStatusName(request.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {format(request.createdAt, "dd/MM/yyyy", { locale: ptBR })}
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
