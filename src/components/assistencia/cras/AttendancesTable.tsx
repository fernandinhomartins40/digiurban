
import React from "react";
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
import { Edit, Eye, Calendar } from "lucide-react";

export interface AttendancesTableProps {
  attendances: SocialAttendance[];
  loading: boolean;
  onView: (attendance: SocialAttendance) => void;
  onEdit: (attendance: SocialAttendance) => void;
}

const attendanceTypeMap: Record<string, string> = {
  reception: "Acolhida",
  qualified_listening: "Escuta Qualificada",
  referral: "Encaminhamento",
  guidance: "Orientação",
  follow_up: "Acompanhamento",
  other: "Outro",
};

const AttendancesTable: React.FC<AttendancesTableProps> = ({
  attendances,
  loading,
  onView,
  onEdit,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!attendances.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum atendimento cadastrado.</p>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Protocolo</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Acompanhamento</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendances.map((attendance) => (
          <TableRow key={attendance.id}>
            <TableCell className="font-medium">
              {attendance.protocol_number}
            </TableCell>
            <TableCell>
              {formatDate(attendance.attendance_date)}
            </TableCell>
            <TableCell>
              {attendanceTypeMap[attendance.attendance_type] || attendance.attendance_type}
            </TableCell>
            <TableCell className="max-w-[300px] truncate">
              {attendance.description}
            </TableCell>
            <TableCell>
              {attendance.follow_up_required ? (
                <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(attendance.follow_up_date)}
                </Badge>
              ) : (
                <Badge variant="outline">Não</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button size="icon" variant="ghost" onClick={() => onView(attendance)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onEdit(attendance)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AttendancesTable;
