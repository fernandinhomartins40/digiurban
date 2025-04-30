
import React from "react";
import { Loader2, MoreHorizontal } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DirectRequest, RequestStatus } from "@/types/mayorOffice";

interface RequestListProps {
  requests: DirectRequest[] | undefined;
  isLoading: boolean;
  searchQuery: string;
  handleStatusChange: (requestId: string, status: RequestStatus) => Promise<void>;
}

export function RequestList({ 
  requests,
  isLoading,
  searchQuery,
  handleStatusChange
}: RequestListProps) {
  // Filter requests by search query
  const filteredRequests = requests?.filter((request) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      request.title.toLowerCase().includes(query) ||
      request.description.toLowerCase().includes(query) ||
      request.protocolNumber.toLowerCase().includes(query) ||
      request.targetDepartment.toLowerCase().includes(query)
    );
  });

  // Mappers for display
  const mapStatusName = (status: string): string => {
    const statusMap: Record<string, string> = {
      open: "Aberta",
      in_progress: "Em Progresso",
      completed: "Concluída",
      cancelled: "Cancelada",
    };
    return statusMap[status] || status;
  };

  const mapPriorityName = (priority: string): string => {
    const priorityMap: Record<string, string> = {
      low: "Baixa",
      normal: "Normal",
      high: "Alta",
      urgent: "Urgente",
    };
    return priorityMap[priority] || priority;
  };

  const getPriorityColor = (priority: string): string => {
    const colorMap: Record<string, string> = {
      low: "bg-blue-100 text-blue-800",
      normal: "bg-green-100 text-green-800",
      high: "bg-amber-100 text-amber-800",
      urgent: "bg-red-100 text-red-800",
    };
    return colorMap[priority] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      open: "bg-blue-100 text-blue-800",
      in_progress: "bg-amber-100 text-amber-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!filteredRequests || filteredRequests.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl font-medium">Nenhuma solicitação encontrada</p>
        <p className="text-muted-foreground mt-2">
          {searchQuery
            ? "Tente ajustar os critérios de busca"
            : "Crie uma nova solicitação para começar"}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Protocolo</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Data</TableHead>
            <TableHead className="w-[70px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((request) => (
            <TableRow key={request.id}>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
