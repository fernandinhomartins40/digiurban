
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  CheckCircle, 
  MoreHorizontal, 
  Pencil, 
  AlertCircle 
} from "lucide-react";
import { HRAttendance, HRAttendanceStatus } from "@/types/hr";

interface AttendanceColumnMeta {
  onStatusChange: (id: string, status: HRAttendanceStatus) => void;
  onEditAttendance: (attendance: HRAttendance) => void;
}

// Formats the date to a nicer format
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Returns appropriate badge for each status
const getStatusBadge = (status: HRAttendanceStatus) => {
  switch (status) {
    case "in_progress":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Em Andamento</Badge>;
    case "concluded":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluído</Badge>;
    case "cancelled":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const AttendanceColumnDef: ColumnDef<HRAttendance>[] = [
  {
    accessorKey: "employeeName",
    header: "Funcionário",
    cell: ({ row }) => <div>{row.original.employeeName}</div>,
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.original.description}>
        {row.original.description}
      </div>
    ),
  },
  {
    accessorKey: "serviceName",
    header: "Serviço",
    cell: ({ row }) => <div>{row.original.serviceName || "N/A"}</div>,
  },
  {
    accessorKey: "attendanceDate",
    header: "Data do Atendimento",
    cell: ({ row }) => <div>{formatDate(row.original.attendanceDate)}</div>,
  },
  {
    accessorKey: "attendedByName",
    header: "Atendido Por",
    cell: ({ row }) => <div>{row.original.attendedByName}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.original.status),
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const attendance = row.original;
      const meta = table.options.meta as AttendanceColumnMeta;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => meta.onEditAttendance(attendance)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            {attendance.status !== "concluded" && (
              <DropdownMenuItem 
                onClick={() => meta.onStatusChange(attendance.id, "concluded")}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Marcar como Concluído
              </DropdownMenuItem>
            )}
            {attendance.status !== "cancelled" && (
              <DropdownMenuItem 
                onClick={() => meta.onStatusChange(attendance.id, "cancelled")}
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Cancelar Atendimento
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
