
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Appointment, AppointmentStatus } from "@/types/mayorOffice";
import { getMayorAppointments } from "@/services/mayorOffice/appointmentsService";

interface AppointmentsTableProps {
  filterStatus: AppointmentStatus | "all";
  onAppointmentClick: (appointment: Appointment) => void;
}

export function AppointmentsTable({ 
  filterStatus, 
  onAppointmentClick 
}: AppointmentsTableProps) {
  // Fetch appointments
  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ["mayorAppointments", filterStatus],
    queryFn: () => getMayorAppointments(filterStatus !== "all" ? filterStatus : undefined),
  });

  // Format date helper
  const formatAppointmentDate = (date: string) => {
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return date;
    }
  };

  // Get badge based on status
  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>;
      case "approved":
        return <Badge variant="default">Aprovado</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeitado</Badge>;
      case "completed":
        return <Badge variant="outline">Concluído</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Carregando agendamentos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-destructive font-medium">Erro ao carregar agendamentos</p>
        <p className="text-muted-foreground text-sm mt-1">
          {error instanceof Error ? error.message : "Ocorreu um erro desconhecido"}
        </p>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-muted-foreground">
          Nenhum agendamento encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Assunto</TableHead>
            <TableHead>Solicitante</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Local</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell className="font-medium">
                {appointment.subject}
              </TableCell>
              <TableCell>{appointment.requesterName}</TableCell>
              <TableCell>
                {formatAppointmentDate(appointment.requestedDate.toString())}
              </TableCell>
              <TableCell>{appointment.requestedTime}</TableCell>
              <TableCell>{getStatusBadge(appointment.status)}</TableCell>
              <TableCell>{appointment.location || "-"}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAppointmentClick(appointment)}
                >
                  Detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
