
import React from "react";
import { format } from "date-fns";
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
import { SocialAttendance } from "@/types/assistance";
import { Eye, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AttendancesTableProps {
  attendances: SocialAttendance[];
  loading: boolean;
  onView: (attendance: SocialAttendance) => void;
  onEdit: (attendance: SocialAttendance) => void;
}

export default function AttendancesTable({
  attendances,
  loading,
  onView,
  onEdit,
}: AttendancesTableProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        ))}
      </div>
    );
  }

  const getAttendanceTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; className: string }> = {
      reception: {
        label: "Acolhida",
        className: "bg-blue-100 text-blue-800",
      },
      qualified_listening: {
        label: "Escuta Qualificada",
        className: "bg-purple-100 text-purple-800",
      },
      referral: {
        label: "Encaminhamento",
        className: "bg-yellow-100 text-yellow-800",
      },
      guidance: {
        label: "Orientação",
        className: "bg-green-100 text-green-800",
      },
      follow_up: {
        label: "Acompanhamento",
        className: "bg-indigo-100 text-indigo-800",
      },
      other: {
        label: "Outro",
        className: "bg-gray-100 text-gray-800",
      },
    };

    const type_info = typeMap[type] || {
      label: type,
      className: "bg-slate-100 text-slate-800",
    };

    return <Badge className={type_info.className}>{type_info.label}</Badge>;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Protocolo</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Tipo de Atendimento</TableHead>
          <TableHead>ID do Cidadão</TableHead>
          <TableHead>Acompanhamento</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendances.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10 text-gray-500">
              Nenhum atendimento encontrado.
            </TableCell>
          </TableRow>
        ) : (
          attendances.map((attendance) => (
            <TableRow key={attendance.id}>
              <TableCell className="font-medium">
                {attendance.protocol_number}
              </TableCell>
              <TableCell>
                {format(new Date(attendance.attendance_date), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell>
                {getAttendanceTypeBadge(attendance.attendance_type)}
              </TableCell>
              <TableCell>{attendance.citizen_id}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    attendance.follow_up_required
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {attendance.follow_up_required ? "Necessário" : "Não necessário"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(attendance)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(attendance)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
