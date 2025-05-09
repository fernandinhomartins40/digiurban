
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { HRAttendance } from "@/types/hr";
import { format } from "date-fns";

interface AttendanceListProps {
  attendances: HRAttendance[];
  isLoading: boolean;
  onView: (attendance: HRAttendance) => void;
  onEdit: (attendance: HRAttendance) => void;
  onDelete: (attendanceId: string) => void;
}

export const AttendanceList = ({
  attendances,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: AttendanceListProps) => {
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  const handleDeleteClick = (attendanceId: string) => {
    setConfirmingDelete(attendanceId);
  };

  const handleConfirmDelete = (attendanceId: string) => {
    onDelete(attendanceId);
    setConfirmingDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmingDelete(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return <Badge className="bg-blue-500">Em andamento</Badge>;
      case "concluded":
        return <Badge className="bg-green-500">Concluído</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atendimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (attendances.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atendimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum atendimento registrado.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atendimentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Servidor</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendances.map((attendance) => (
                <TableRow key={attendance.id}>
                  <TableCell>
                    {format(new Date(attendance.attendanceDate), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell>{attendance.employeeName}</TableCell>
                  <TableCell>{attendance.serviceName || "N/A"}</TableCell>
                  <TableCell>{getStatusBadge(attendance.status)}</TableCell>
                  <TableCell>{attendance.attendedByName}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(attendance)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(attendance)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {confirmingDelete === attendance.id ? (
                      <>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleConfirmDelete(attendance.id)}
                        >
                          Confirmar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelDelete}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(attendance.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceList;
