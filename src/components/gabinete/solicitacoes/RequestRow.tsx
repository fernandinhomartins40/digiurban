
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreHorizontal } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DirectRequest, RequestStatus } from "@/types/mayorOffice";
import { 
  getStatusColor, 
  getPriorityColor, 
  mapStatusName, 
  mapPriorityName 
} from "@/utils/requestMappers";

interface RequestRowProps {
  request: DirectRequest;
  handleStatusChange: (requestId: string, status: RequestStatus) => Promise<void>;
}

export function RequestRow({ request, handleStatusChange }: RequestRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium text-xs md:text-sm">
        {request.protocolNumber}
      </TableCell>
      <TableCell>{request.title}</TableCell>
      <TableCell>{request.targetDepartment}</TableCell>
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
      <TableCell className="hidden md:table-cell">
        {format(request.createdAt, "dd/MM/yyyy", { locale: ptBR })}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {request.status === "open" && (
              <DropdownMenuItem
                onClick={() => handleStatusChange(request.id, "in_progress")}
              >
                Iniciar processamento
              </DropdownMenuItem>
            )}
            {request.status === "in_progress" && (
              <DropdownMenuItem
                onClick={() => handleStatusChange(request.id, "completed")}
              >
                Marcar como concluída
              </DropdownMenuItem>
            )}
            {(request.status === "open" || request.status === "in_progress") && (
              <DropdownMenuItem
                onClick={() => handleStatusChange(request.id, "cancelled")}
              >
                Cancelar solicitação
              </DropdownMenuItem>
            )}
            {request.status === "completed" && (
              <DropdownMenuItem
                onClick={() => handleStatusChange(request.id, "in_progress")}
              >
                Reabrir solicitação
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
