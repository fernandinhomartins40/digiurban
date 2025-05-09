
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HRAttendance } from "@/types/hr";
import { format } from "date-fns";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface AttendanceDetailProps {
  attendance: HRAttendance | null;
  isOpen: boolean;
  onClose: () => void;
  employeeHistory?: HRAttendance[];
}

export const AttendanceDetail = ({
  attendance,
  isOpen,
  onClose,
  employeeHistory = [],
}: AttendanceDetailProps) => {
  if (!attendance) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "concluded":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Atendimento</DialogTitle>
          <DialogDescription>
            Visualizando detalhes do atendimento realizado em{" "}
            {format(new Date(attendance.attendanceDate), "dd/MM/yyyy HH:mm")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">
                Servidor
              </h3>
              <p>{attendance.employeeName}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">
                Serviço
              </h3>
              <p>{attendance.serviceName || "N/A"}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
            <div className="flex items-center gap-2 mt-1">
              {getStatusIcon(attendance.status)}
              {getStatusBadge(attendance.status)}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm text-muted-foreground">
              Descrição
            </h3>
            <p>{attendance.description}</p>
          </div>

          {attendance.notes && (
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">
                Observações
              </h3>
              <p>{attendance.notes}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">
                Responsável
              </h3>
              <p>{attendance.attendedByName}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">
                Data
              </h3>
              <p>
                {format(
                  new Date(attendance.attendanceDate),
                  "dd/MM/yyyy HH:mm"
                )}
              </p>
            </div>
          </div>

          {employeeHistory.length > 0 && (
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Histórico de Atendimentos</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {employeeHistory.map((item) => (
                    <li
                      key={item.id}
                      className="border-b pb-2 last:border-0 flex flex-col md:flex-row md:justify-between"
                    >
                      <div>
                        <span className="text-sm">
                          {format(
                            new Date(item.attendanceDate),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </span>
                        <p className="text-sm font-medium">
                          {item.serviceName || "Atendimento geral"}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {getStatusBadge(item.status)}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceDetail;
