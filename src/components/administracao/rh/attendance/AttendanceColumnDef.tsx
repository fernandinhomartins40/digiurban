
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { HRAttendance, HRAttendanceStatus } from "@/types/hr";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Add proper typing for the table meta
interface AttendanceTableMeta {
  handleUpdateStatus?: (id: string, status: HRAttendanceStatus) => void;
}

// Add the table meta to the module declaration
declare module '@tanstack/react-table' {
  interface TableMeta<TData> extends AttendanceTableMeta {}
}

const getStatusBadge = (status: HRAttendanceStatus) => {
  switch (status) {
    case 'in_progress':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Em Andamento</Badge>;
    case 'concluded':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluído</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const AttendanceColumnDef: ColumnDef<HRAttendance>[] = [
  {
    accessorKey: "employeeName",
    header: "Funcionário",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.employeeName}</div>
        <div className="text-sm text-muted-foreground">ID: {row.original.employeeId}</div>
      </div>
    ),
  },
  {
    accessorKey: "serviceName",
    header: "Serviço",
    cell: ({ row }) => row.original.serviceName || "-",
  },
  {
    accessorKey: "attendanceDate",
    header: "Data",
    cell: ({ row }) => format(row.original.attendanceDate, "dd/MM/yyyy HH:mm", { locale: ptBR }),
  },
  {
    accessorKey: "attendedByName",
    header: "Atendido Por",
    cell: ({ row }) => row.original.attendedByName || "-",
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
      const meta = table.options.meta;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={attendance.status === 'concluded'}
              onClick={() => meta?.handleUpdateStatus && meta.handleUpdateStatus(attendance.id, 'concluded')}
            >
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              Marcar como concluído
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={attendance.status === 'in_progress'}
              onClick={() => meta?.handleUpdateStatus && meta.handleUpdateStatus(attendance.id, 'in_progress')}
            >
              <Clock className="mr-2 h-4 w-4 text-blue-500" />
              Marcar como em andamento
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={attendance.status === 'cancelled'}
              onClick={() => meta?.handleUpdateStatus && meta.handleUpdateStatus(attendance.id, 'cancelled')}
            >
              <XCircle className="mr-2 h-4 w-4 text-red-500" />
              Marcar como cancelado
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default AttendanceColumnDef;
