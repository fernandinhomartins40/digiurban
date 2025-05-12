
import React, { useState, useEffect } from "react";
import { useApiQuery, useApiMutation } from "@/lib/hooks/useApiQuery";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import { HRAttendance, HRAttendanceStatus, HRAttendanceFilterStatus, HRService } from "@/types/hr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchServices } from "@/services/administration/hr/services";
import { fetchAttendances, updateAttendance } from "@/services/administration/hr/attendances";
import AttendanceList from "@/components/administracao/rh/attendance/AttendanceList";
import AttendanceForm from "@/components/administracao/rh/attendance/AttendanceForm";
import AttendanceStats from "@/components/administracao/rh/attendance/AttendanceStats";

export default function AttendancePage() {
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<HRAttendanceFilterStatus>("all");
  const [selectedAttendance, setSelectedAttendance] = useState<HRAttendance | null>(null);

  // Fetch services
  const { data: servicesResponse, isLoading: isLoadingServices } = useApiQuery(
    ["hr-services"],
    () => fetchServices(),
    { enabled: true }
  );
  
  // Create a variable for the services from the response
  const services: HRService[] = servicesResponse?.data || [];

  // Fetch attendances with filters
  const { 
    data: attendancesResponse, 
    isLoading: isLoadingAttendances,
    refetch: refetchAttendances
  } = useApiQuery(
    ["hr-attendances", statusFilter],
    () => fetchAttendances(statusFilter),
    { enabled: true }
  );

  // Create a variable for the attendances from the response
  const attendances: HRAttendance[] = attendancesResponse?.data || [];

  // Handle status update
  const { mutate: updateStatus, isLoading: isUpdating } = useApiMutation(
    async (data: { id: string; status: HRAttendanceStatus }) => {
      const result = await updateAttendance(data.id, { status: data.status });
      return result;
    },
    {
      onSuccess: (response) => {
        if (response.status === 'success') {
          toast({
            title: "Status atualizado",
            description: "O status do atendimento foi atualizado com sucesso.",
          });
          refetchAttendances();
        } else {
          toast({
            title: "Erro",
            description: "Ocorreu um erro ao atualizar o status.",
            variant: "destructive",
          });
        }
      },
      onError: (error) => {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao atualizar o status.",
          variant: "destructive",
        });
        console.error("Error updating attendance status:", error);
      },
    }
  );

  // Handle attendance creation
  const handleAttendanceCreated = () => {
    setShowForm(false);
    refetchAttendances();
    toast({
      title: "Atendimento registrado",
      description: "O novo atendimento foi registrado com sucesso.",
    });
  };

  // Handle attendance editing
  const handleEditAttendance = (attendance: HRAttendance) => {
    setSelectedAttendance(attendance);
    setShowForm(true);
  };

  // Handle status change
  const handleStatusChange = (attendanceId: string, newStatus: HRAttendanceStatus) => {
    updateStatus({ id: attendanceId, status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Atendimentos RH</h1>
          <p className="text-muted-foreground">
            Registre e gerencie os atendimentos realizados pelo setor de Recursos Humanos.
          </p>
        </div>
        <Button onClick={() => { setSelectedAttendance(null); setShowForm(!showForm); }}>
          {showForm ? "Cancelar" : <><Plus className="mr-2 h-4 w-4" /> Novo Atendimento</>}
        </Button>
      </div>

      {!showForm && <AttendanceStats />}

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{selectedAttendance ? "Editar Atendimento" : "Novo Atendimento"}</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceForm 
              services={services}
              initialData={selectedAttendance}
              onSuccess={handleAttendanceCreated}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Histórico de Atendimentos</CardTitle>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as HRAttendanceFilterStatus)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="concluded">Concluídos</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {isLoadingAttendances ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <AttendanceList
                attendances={attendances}
                onStatusChange={handleStatusChange}
                onEdit={handleEditAttendance}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
