
import React, { useState, Suspense } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Appointment, AppointmentStatus } from "@/types/mayorOffice";
import { AppointmentDrawer } from "@/components/gabinete/agendamentos/AppointmentDrawer";
import { NewAppointmentDialog } from "@/components/gabinete/agendamentos/NewAppointmentDialog";
import { AppointmentFilters } from "@/components/gabinete/agendamentos/AppointmentFilters";
import { AppointmentsTable } from "@/components/gabinete/agendamentos/AppointmentsTable";
import { useAppointmentActions } from "@/components/gabinete/agendamentos/useAppointmentActions";

export default function AppointmentScheduler() {
  const queryClient = useQueryClient();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | "all">("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isNewAppointmentDialogOpen, setIsNewAppointmentDialogOpen] = useState(false);
  const { handleStatusChange } = useAppointmentActions();

  // Handle appointment click
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDrawerOpen(true);
  };

  // Create wrapper functions to match the expected types
  const handleApprove = (appointmentId: string): Promise<void> => {
    return handleStatusChange(appointmentId, "approved");
  };

  const handleReject = (appointmentId: string): Promise<void> => {
    return handleStatusChange(appointmentId, "rejected");
  };

  const handleComplete = (appointmentId: string): Promise<void> => {
    return handleStatusChange(appointmentId, "completed");
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
          
          <AppointmentFilters 
            filterStatus={filterStatus} 
            setFilterStatus={setFilterStatus} 
          />
        </CardHeader>
        
        <CardContent>
          <Suspense fallback={
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Carregando...</span>
            </div>
          }>
            <AppointmentsTable 
              filterStatus={filterStatus} 
              onAppointmentClick={handleAppointmentClick} 
            />
          </Suspense>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Gerenciamento de agendamentos
          </div>
        </CardFooter>
      </Card>

      {/* Appointment Drawer */}
      <AppointmentDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        appointment={selectedAppointment}
        onApprove={handleApprove}
        onReject={handleReject}
        onComplete={handleComplete}
      />
    </div>
  );
}
