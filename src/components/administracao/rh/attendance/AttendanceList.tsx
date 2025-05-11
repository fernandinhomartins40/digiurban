
import React from "react";
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, Check, Ban, Info, CheckCircle, 
  Clock, XCircle 
} from "lucide-react";
import { HRAttendance, HRAttendanceStatus } from "@/types/hr";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AttendanceListProps {
  attendances: HRAttendance[];
  isLoading: boolean;
  onStatusChange: (id: string, status: HRAttendanceStatus) => void;
}

export default function AttendanceList({
  attendances,
  isLoading,
  onStatusChange,
}: AttendanceListProps) {
  const getStatusIcon = (status: HRAttendanceStatus) => {
    switch (status) {
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "concluded":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: HRAttendanceStatus) => {
    switch (status) {
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Em Andamento</Badge>;
      case "concluded":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Concluído</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const formatDate = (dateString: Date | string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  if (isLoading) {
    return <div className="py-8 text-center">Carregando atendimentos...</div>;
  }

  if (attendances.length === 0) {
    return <div className="py-8 text-center">Nenhum atendimento encontrado.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Funcionário</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Atendente</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendances.map((attendance) => (
            <TableRow key={attendance.id}>
              <TableCell className="font-medium">{attendance.employeeName}</TableCell>
              <TableCell>{attendance.serviceName || "N/A"}</TableCell>
              <TableCell>{formatDate(attendance.attendanceDate)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(attendance.status)}
                  {getStatusBadge(attendance.status)}
                </div>
              </TableCell>
              <TableCell>{attendance.attendedByName}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Info className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </DropdownMenuItem>
                    
                    {attendance.status === "in_progress" && (
                      <>
                        <DropdownMenuItem onClick={() => onStatusChange(attendance.id, "concluded")}>
                          <Check className="mr-2 h-4 w-4" />
                          Marcar como Concluído
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(attendance.id, "cancelled")}>
                          <Ban className="mr-2 h-4 w-4" />
                          Cancelar Atendimento
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
  );
}
