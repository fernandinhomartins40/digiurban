
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, isSameDay, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, Loader2, Search } from "lucide-react";
import { getMayorAppointments } from "@/services/mayorOfficeService";
import { MayorAppointment, AppointmentStatus } from "@/types/mayorOffice";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AppointmentScheduler() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<MayorAppointment | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState<"approved" | "rejected">("approved");

  // Fetch appointments
  const {
    data: appointments,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["mayorAppointments", selectedStatus],
    queryFn: () => {
      const status = selectedStatus !== "all" ? selectedStatus : undefined;
      return getMayorAppointments(status);
    },
  });

  // Filter appointments by search query and date
  const filteredAppointments = appointments?.filter((appointment) => {
    if (selectedDate && !isSameDay(appointment.requestedDate, selectedDate)) {
      return false;
    }
    
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      appointment.requesterName.toLowerCase().includes(query) ||
      appointment.subject.toLowerCase().includes(query) ||
      appointment.requesterEmail.toLowerCase().includes(query) ||
      (appointment.description && appointment.description.toLowerCase().includes(query))
    );
  });

  // Mutation to respond to appointment request
  const respondMutation = useMutation({
    mutationFn: async ({ id, status, message }: { id: string; status: AppointmentStatus; message: string }) => {
      if (!user) throw new Error("User not authenticated");
      
      return supabase
        .from("mayor_appointments")
        .update({
          status: status,
          response_message: message,
          responded_by: user.id,
          responded_at: new Date().toISOString(),
        })
        .eq("id", id);
    },
    onSuccess: () => {
      toast({
        title: "Resposta enviada",
        description: "A resposta ao agendamento foi enviada com sucesso.",
      });
      setIsResponseDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Erro ao responder",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle respond to appointment
  const handleRespondToAppointment = () => {
    if (!selectedAppointment) return;
    
    respondMutation.mutate({
      id: selectedAppointment.id,
      status: responseStatus,
      message: responseMessage,
    });
  };

  // Format appointment time
  const formatAppointmentTime = (timeString: string) => {
    try {
      const date = parse(timeString, "HH:mm:ss", new Date());
      return format(date, "HH:mm");
    } catch {
      // If parsing fails, just return the first 5 characters (HH:mm)
      return timeString.slice(0, 5);
    }
  };

  // Map status to display name
  const mapStatusName = (status: string): string => {
    const statusMap: Record<string, string> = {
      pending: "Pendente",
      approved: "Aprovado",
      rejected: "Rejeitado",
      completed: "Concluído",
      cancelled: "Cancelado",
    };
    return statusMap[status] || status;
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      pending: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-purple-100 text-purple-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
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
            Gerencie solicitações de audiências e a agenda oficial.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Calendar Section */}
        <div className="md:col-span-4 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Calendário</CardTitle>
              <CardDescription>Selecione uma data para ver os agendamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border w-full"
                locale={ptBR}
              />
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedDate(new Date())}
              >
                Hoje
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Appointments List */}
        <div className="md:col-span-8 lg:col-span-9">
          <Card className="h-full">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-lg">Agendamentos</CardTitle>
                  <CardDescription>
                    {selectedDate
                      ? `Agendamentos para ${format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`
                      : "Todos os agendamentos"}
                  </CardDescription>
                </div>
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-8 w-full md:w-[250px]"
                      placeholder="Buscar agendamento..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs
                defaultValue="all"
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as AppointmentStatus | "all")}
                className="w-full"
              >
                <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-5 gap-2">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="pending">Pendentes</TabsTrigger>
                  <TabsTrigger value="approved">Aprovados</TabsTrigger>
                  <TabsTrigger value="rejected">Rejeitados</TabsTrigger>
                  <TabsTrigger value="completed">Concluídos</TabsTrigger>
                </TabsList>

                <div className="mt-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredAppointments && filteredAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {filteredAppointments.map((appointment) => (
                        <Card key={appointment.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="p-4 md:p-6 flex-1">
                              <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                                <h3 className="text-lg font-semibold">{appointment.subject}</h3>
                                <Badge className={getStatusColor(appointment.status)}>
                                  {mapStatusName(appointment.status)}
                                </Badge>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {format(appointment.requestedDate, "dd/MM/yyyy", { locale: ptBR })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{formatAppointmentTime(appointment.requestedTime)}</span>
                                  <span className="text-muted-foreground">
                                    ({appointment.durationMinutes} minutos)
                                  </span>
                                </div>
                              </div>
                              
                              <div className="mt-4">
                                <div className="text-sm font-medium">Solicitante:</div>
                                <div className="flex flex-col">
                                  <span>{appointment.requesterName}</span>
                                  <span className="text-sm text-muted-foreground">{appointment.requesterEmail}</span>
                                  {appointment.requesterPhone && (
                                    <span className="text-sm text-muted-foreground">{appointment.requesterPhone}</span>
                                  )}
                                </div>
                              </div>

                              {appointment.description && (
                                <div className="mt-4">
                                  <div className="text-sm font-medium">Descrição:</div>
                                  <p className="text-sm text-muted-foreground mt-1">{appointment.description}</p>
                                </div>
                              )}
                              
                              {appointment.responseMessage && (
                                <div className="mt-4">
                                  <div className="text-sm font-medium">Resposta:</div>
                                  <p className="text-sm text-muted-foreground mt-1">{appointment.responseMessage}</p>
                                </div>
                              )}
                              
                              {appointment.status === "pending" && (
                                <div className="mt-4 flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedAppointment(appointment);
                                      setResponseStatus("approved");
                                      setResponseMessage("");
                                      setIsResponseDialogOpen(true);
                                    }}
                                  >
                                    Aprovar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedAppointment(appointment);
                                      setResponseStatus("rejected");
                                      setResponseMessage("");
                                      setIsResponseDialogOpen(true);
                                    }}
                                  >
                                    Rejeitar
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-xl font-medium">Nenhum agendamento encontrado</p>
                      <p className="text-muted-foreground mt-2">
                        {searchQuery
                          ? "Tente ajustar os critérios de busca"
                          : selectedDate
                          ? "Nenhum agendamento para esta data"
                          : "Não há agendamentos registrados"}
                      </p>
                    </div>
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {responseStatus === "approved" ? "Aprovar Agendamento" : "Rejeitar Agendamento"}
            </DialogTitle>
            <DialogDescription>
              {responseStatus === "approved"
                ? "Envie uma mensagem de confirmação para o solicitante."
                : "Explique o motivo da rejeição para o solicitante."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedAppointment && (
              <div className="grid gap-2">
                <div>
                  <span className="font-medium">Solicitação:</span> {selectedAppointment.subject}
                </div>
                <div>
                  <span className="font-medium">Solicitante:</span> {selectedAppointment.requesterName}
                </div>
                <div>
                  <span className="font-medium">Data:</span>{" "}
                  {format(selectedAppointment.requestedDate, "dd/MM/yyyy", { locale: ptBR })} às{" "}
                  {formatAppointmentTime(selectedAppointment.requestedTime)}
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Escreva uma mensagem para o solicitante..."
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                rows={5}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleRespondToAppointment}
              disabled={respondMutation.isPending}
              variant={responseStatus === "approved" ? "default" : "destructive"}
            >
              {respondMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : responseStatus === "approved" ? (
                "Confirmar Aprovação"
              ) : (
                "Confirmar Rejeição"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
