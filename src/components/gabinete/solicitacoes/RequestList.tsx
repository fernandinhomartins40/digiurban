
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
import { 
  getStatusColor, 
  getPriorityColor, 
  mapStatusName, 
  mapPriorityName 
} from "@/utils/requestMappers";
import { RequestRow } from "./RequestRow";
import { EmptyRequests } from "./EmptyRequests";
import { LoadingSpinner } from "./LoadingSpinner";

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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!filteredRequests || filteredRequests.length === 0) {
    return <EmptyRequests searchQuery={searchQuery} />;
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
            <RequestRow 
              key={request.id} 
              request={request} 
              handleStatusChange={handleStatusChange} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
