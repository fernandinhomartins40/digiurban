
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Appointment, AppointmentStatus } from "@/types/mayorOffice";
import { getMayorAppointments } from "@/services/mayorOffice/appointmentsService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface AppointmentsTableProps {
  filterStatus: AppointmentStatus | "all";
  searchTerm?: string;
  onAppointmentClick: (appointment: Appointment) => void;
}

export function AppointmentsTable({ 
  filterStatus, 
  searchTerm,
  onAppointmentClick 
}: AppointmentsTableProps) {
  const status = filterStatus === "all" ? undefined : filterStatus;
  
  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ["mayorAppointments", status, searchTerm],
    queryFn: () => getMayorAppointments(status, searchTerm),
  });

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
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>
          Não foi possível carregar os agendamentos. Tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Nenhum agendamento encontrado</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {filterStatus !== "all" 
            ? `Não há agendamentos com status "${filterStatus}".` 
            : "Não há agendamentos disponíveis."}
          {searchTerm && " Tente usar outros termos de busca."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Solicitante</TableHead>
            <TableHead>Assunto</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell className="font-medium">{appointment.requesterName}</TableCell>
              <TableCell>{appointment.subject}</TableCell>
              <TableCell>
                {format(new Date(appointment.requestedDate), "dd 'de' MMMM', às' HH:mm", { locale: ptBR })}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={
                    appointment.status === "approved" ? "default" :
                    appointment.status === "rejected" ? "destructive" :
                    appointment.status === "completed" ? "outline" :
                    "secondary"
                  }
                >
                  {appointment.status === "pending" && "Pendente"}
                  {appointment.status === "approved" && "Aprovado"}
                  {appointment.status === "rejected" && "Rejeitado"}
                  {appointment.status === "completed" && "Concluído"}
                  {appointment.status === "cancelled" && "Cancelado"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={
                    appointment.priority === "high" ? "destructive" :
                    appointment.priority === "low" ? "outline" :
                    "secondary"
                  }
                >
                  {appointment.priority === "high" && "Alta"}
                  {appointment.priority === "normal" && "Normal"}
                  {appointment.priority === "low" && "Baixa"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
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
