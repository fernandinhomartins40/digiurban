
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { getMayorAppointments } from "@/services/mayorOffice/appointmentsService";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, Filter, List, CalendarDays } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewAppointmentDialog } from "@/components/gabinete/agendamentos/NewAppointmentDialog";
import { AppointmentDetails } from "@/components/gabinete/agendamentos/AppointmentDetails";
import { AppointmentStatus } from "@/types/mayorOffice";

export default function AppointmentScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["mayorAppointments", statusFilter],
    queryFn: () => {
      const status = statusFilter !== "all" ? statusFilter as AppointmentStatus : undefined;
      return getMayorAppointments(status);
    },
  });

  // Filter appointments for the selected date
  const appointmentsForSelectedDate = appointments?.filter(
    (appointment) => 
      selectedDate && 
      format(appointment.requestedDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  );

  // Get dates with appointments for highlighting in calendar
  const datesWithAppointments = appointments?.map(
    (appointment) => new Date(appointment.requestedDate)
  );

  const handleOpenAppointmentDetails = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
  };

  const handleCloseAppointmentDetails = () => {
    setSelectedAppointmentId(null);
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
            Gerencie solicitações de agendamentos com o prefeito
          </p>
        </div>

        <div className="flex gap-2">
          <Tabs 
            defaultValue={view} 
            value={view}
            onValueChange={(v) => setView(v as "calendar" | "list")}
            className="hidden md:flex"
          >
            <TabsList>
              <TabsTrigger value="calendar">
                <CalendarDays className="h-4 w-4 mr-2" />
                Calendário
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4 mr-2" />
                Lista
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button onClick={() => setIsNewAppointmentOpen(true)}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 order-2 lg:order-1">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>
                    {selectedDate ? format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Agendamentos"}
                  </CardTitle>
                  <CardDescription>
                    {view === "calendar" 
                      ? "Selecione uma data para ver os agendamentos" 
                      : "Visualize todos os agendamentos"
                    }
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select 
                    value={statusFilter} 
                    onValueChange={(value: string) => setStatusFilter(value as AppointmentStatus | "all")}
                  >
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
                      <SelectItem value="approved">Aprovados</SelectItem>
                      <SelectItem value="rejected">Rejeitados</SelectItem>
                      <SelectItem value="completed">Concluídos</SelectItem>
                      <SelectItem value="cancelled">Cancelados</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Tabs 
                    defaultValue={view} 
                    value={view}
                    onValueChange={(v) => setView(v as "calendar" | "list")}
                    className="md:hidden"
                  >
                    <TabsList>
                      <TabsTrigger value="calendar">
                        <CalendarDays className="h-4 w-4" />
                      </TabsTrigger>
                      <TabsTrigger value="list">
                        <List className="h-4 w-4" />
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : view === "calendar" ? (
                <>
                  <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
                    <div className="flex-1 overflow-hidden">
                      <h3 className="text-sm font-medium mb-3">
                        Agendamentos para {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "hoje"}
                      </h3>
                      
                      {appointmentsForSelectedDate && appointmentsForSelectedDate.length > 0 ? (
                        <div className="space-y-3">
                          {appointmentsForSelectedDate.map(appointment => (
                            <div 
                              key={appointment.id} 
                              className="p-3 border rounded-lg cursor-pointer hover:bg-accent"
                              onClick={() => handleOpenAppointmentDetails(appointment.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{appointment.subject}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {appointment.requesterName}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="text-sm font-medium">
                                    {appointment.requestedTime}
                                  </span>
                                  <Badge variant={
                                    appointment.status === "approved" ? "default" :
                                    appointment.status === "rejected" ? "destructive" :
                                    appointment.status === "completed" ? "outline" :
                                    appointment.status === "cancelled" ? "destructive" :
                                    "secondary"
                                  }>
                                    {appointment.status === "pending" && "Pendente"}
                                    {appointment.status === "approved" && "Aprovado"}
                                    {appointment.status === "rejected" && "Rejeitado"}
                                    {appointment.status === "completed" && "Concluído"}
                                    {appointment.status === "cancelled" && "Cancelado"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <CalendarPlus className="h-12 w-12 text-muted-foreground/50 mb-4" />
                          <h4 className="text-lg font-medium">Nenhum agendamento</h4>
                          <p className="text-muted-foreground max-w-xs mt-1">
                            Não há agendamentos para esta data. Clique em "Novo Agendamento" para criar um.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  {appointments && appointments.length > 0 ? (
                    appointments.map(appointment => (
                      <div 
                        key={appointment.id} 
                        className="p-3 border rounded-lg cursor-pointer hover:bg-accent"
                        onClick={() => handleOpenAppointmentDetails(appointment.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{appointment.subject}</h4>
                            <p className="text-sm text-muted-foreground">
                              {appointment.requesterName} • {format(appointment.requestedDate, "dd/MM/yyyy", { locale: ptBR })}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-medium">
                              {appointment.requestedTime}
                            </span>
                            <Badge variant={
                              appointment.status === "approved" ? "default" :
                              appointment.status === "rejected" ? "destructive" :
                              appointment.status === "completed" ? "outline" :
                              appointment.status === "cancelled" ? "destructive" :
                              "secondary"
                            }>
                              {appointment.status === "pending" && "Pendente"}
                              {appointment.status === "approved" && "Aprovado"}
                              {appointment.status === "rejected" && "Rejeitado"}
                              {appointment.status === "completed" && "Concluído"}
                              {appointment.status === "cancelled" && "Cancelado"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <CalendarPlus className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h4 className="text-lg font-medium">Nenhum agendamento</h4>
                      <p className="text-muted-foreground max-w-xs mt-1">
                        Não há agendamentos disponíveis com os filtros selecionados.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Total: {appointments?.length || 0} agendamentos
              </p>
            </CardFooter>
          </Card>
        </div>

        {view === "calendar" && (
          <div className="lg:w-[350px] min-w-[350px] order-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Calendário</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="calendar-wrapper">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="border rounded-md"
                    modifiers={{
                      hasAppointment: datesWithAppointments || [],
                    }}
                    modifiersStyles={{
                      hasAppointment: {
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(var(--primary) / 0.2)',
                        borderRadius: '4px'
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <NewAppointmentDialog
        open={isNewAppointmentOpen}
        onOpenChange={setIsNewAppointmentOpen}
        onSuccess={() => {
          // Handle success
        }}
      />

      <AppointmentDetails
        appointmentId={selectedAppointmentId}
        isOpen={!!selectedAppointmentId}
        onClose={handleCloseAppointmentDetails}
      />
    </div>
  );
}
