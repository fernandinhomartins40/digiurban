
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AppointmentStatus, Appointment } from "@/types/mayorOffice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getMayorAppointments } from "@/services/mayorOffice/appointmentsService";
import { Loader2 } from "lucide-react";

interface AppointmentsTableProps {
  filterStatus: AppointmentStatus | "all";
  searchTerm?: string;
  onAppointmentClick: (appointment: Appointment) => void;
  isPending?: boolean;
}

export function AppointmentsTable({ 
  filterStatus, 
  searchTerm = "", 
  onAppointmentClick,
  isPending = false
}: AppointmentsTableProps) {
  // Use React Query to fetch appointments
  const { data: appointments, isLoading, isError, error } = useQuery({
    queryKey: ["mayorAppointments", filterStatus, searchTerm],
    queryFn: async () => {
      try {
        return await getMayorAppointments(
          filterStatus === "all" ? undefined : filterStatus,
          searchTerm
        );
      } catch (err) {
        console.error("Error fetching appointments:", err);
        throw err;
      }
    },
    suspense: false, // Ensure this is false to prevent unwanted suspense
  });

  // Status badge colors
  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprovado</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejeitado</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Concluído</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return format(new Date(date), "PP", { locale: ptBR });
  };

  // Safe click handler that won't trigger suspense
  const handleAppointmentClick = React.useCallback(
    (appointment: Appointment) => {
      // Use setTimeout to ensure this doesn't happen in the render phase
      setTimeout(() => {
        onAppointmentClick(appointment);
      }, 0);
    },
    [onAppointmentClick]
  );

  if (isLoading || isPending) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Carregando agendamentos...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Erro ao carregar agendamentos.</p>
        <p className="text-sm">{(error as Error)?.message || "Tente novamente mais tarde."}</p>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum agendamento encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Solicitante</TableHead>
            <TableHead>Assunto</TableHead>
            <TableHead>Data Solicitada</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell className="font-medium">{appointment.requesterName}</TableCell>
              <TableCell>{appointment.subject}</TableCell>
              <TableCell>{formatDate(appointment.requestedDate)}</TableCell>
              <TableCell>{getStatusBadge(appointment.status)}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleAppointmentClick(appointment)}
                >
                  Ver detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
