
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  getMayorAppointments,
  updateMayorAppointmentStatus,
} from "@/services/mayorOffice/appointmentsService";
import { Appointment, AppointmentStatus } from "@/types/mayorOffice";
import { AppointmentDrawer } from "@/components/gabinete/agendamentos/AppointmentDrawer";
import { NewAppointmentDialog } from "@/components/gabinete/agendamentos/NewAppointmentDialog";

export default function AppointmentScheduler() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | "all">("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isNewAppointmentDialogOpen, setIsNewAppointmentDialogOpen] = useState(false);

  // Fetch appointments
  const { data: appointments, isLoading } = useQuery({
    queryKey: ["mayorAppointments", filterStatus],
    queryFn: () => getMayorAppointments(filterStatus !== "all" ? filterStatus : undefined),
  });

  // Update appointment status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ appointmentId, status }: { appointmentId: string; status: AppointmentStatus }) =>
      updateMayorAppointmentStatus(appointmentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mayorAppointments"] });
      toast({
        title: "Status atualizado",
        description: "O status do agendamento foi atualizado com sucesso.",
      });
      setDrawerOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o status do agendamento.",
        variant: "destructive",
      });
    },
  });

  // Handle status change
  const handleStatusChange = async (appointmentId: string, status: AppointmentStatus) => {
    updateStatusMutation.mutate({ appointmentId, status });
  };

  // Handle appointment click
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDrawerOpen(true);
  };

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

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Agendamentos | Gabinete do Prefeito</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agendamentos</h1>
          <p className="text-sm text-muted-foreground">
            Gerenciar agendamentos do prefeito
          </p>
        </div>

        <NewAppointmentDialog 
          open={isNewAppointmentDialogOpen} 
          onOpenChange={setIsNewAppointmentDialogOpen}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["mayorAppointments"] })}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agendamentos</CardTitle>
          <CardDescription>Lista de agendamentos agendados com o prefeito</CardDescription>

          <div className="flex items-center gap-4 mt-4">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              Todos
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("pending")}
            >
              Pendentes
            </Button>
            <Button
              variant={filterStatus === "approved" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("approved")}
            >
              Aprovados
            </Button>
            <Button
              variant={filterStatus === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("completed")}
            >
              Concluídos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : appointments && appointments.length > 0 ? (
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
                          onClick={() => handleAppointmentClick(appointment)}
                        >
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-muted-foreground">
                Nenhum agendamento encontrado.
              </p>
              <NewAppointmentDialog 
                open={isNewAppointmentDialogOpen} 
                onOpenChange={setIsNewAppointmentDialogOpen}
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ["mayorAppointments"] })}
                buttonVariant="outline" 
                className="mt-4"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            {appointments?.length || 0} agendamentos
          </div>
        </CardFooter>
      </Card>

      {/* Appointment Drawer */}
      <AppointmentDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        appointment={selectedAppointment}
        onApprove={appointmentId => handleStatusChange(appointmentId, "approved")}
        onReject={appointmentId => handleStatusChange(appointmentId, "rejected")}
        onComplete={appointmentId => handleStatusChange(appointmentId, "completed")}
      />
    </div>
  );
}
