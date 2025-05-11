
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApiQuery } from "@/lib/hooks/useApiQuery";
import { useApiMutation } from "@/lib/hooks/useApiMutation";
import { HRAttendance, HRAttendanceFilterStatus, HRAttendanceStatus } from "@/types/hr";
import { Plus, FileSearch } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fetchAttendances, updateAttendance } from "@/services/administration/hr/attendances";
import { fetchServices } from "@/services/administration/hr/services";
import AttendanceForm from "@/components/administracao/rh/attendance/AttendanceForm";
import AttendanceList from "@/components/administracao/rh/attendance/AttendanceList";
import AttendanceStats from "@/components/administracao/rh/attendance/AttendanceStats";
import { useAuth } from "@/contexts/auth/useAuth";

export default function HRAttendancePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<HRAttendanceFilterStatus>("all");
  const [filteredAttendances, setFilteredAttendances] = useState<HRAttendance[]>([]);

  // Fetch services
  const { data: services = [] } = useApiQuery(["hr-services"], () => 
    fetchServices(), { enabled: true }
  );

  // Fetch attendances
  const { 
    data: attendances = [], 
    isLoading,
    refetch 
  } = useApiQuery(
    ["hr-attendances", statusFilter], 
    () => fetchAttendances(statusFilter), 
    { enabled: true }
  );

  // Filter attendances based on search term
  useEffect(() => {
    if (!attendances) {
      setFilteredAttendances([]);
      return;
    }

    const filtered = attendances.filter(attendance => {
      const matchesSearch = 
        !searchTerm || 
        attendance.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendance.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendance.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });

    setFilteredAttendances(filtered);
  }, [searchTerm, attendances]);

  // Update attendance status mutation
  const updateAttendanceMutation = useApiMutation(
    "updateAttendance",
    (data: { id: string; status: HRAttendanceStatus }) => 
      updateAttendance(data.id, { status: data.status }),
    {
      onSuccess: () => {
        toast({
          title: "Status atualizado",
          description: "O status do atendimento foi atualizado com sucesso.",
        });
        refetch();
      },
      onError: (error: any) => {
        toast({
          title: "Erro",
          description: error.message || "Ocorreu um erro ao atualizar o status do atendimento.",
          variant: "destructive",
        });
      },
    }
  );

  const handleStatusChange = (id: string, status: HRAttendanceStatus) => {
    updateAttendanceMutation.mutate({ id, status });
  };

  const handleAttendanceCreated = () => {
    refetch();
    setActiveTab("list");
    toast({
      title: "Atendimento registrado",
      description: "O atendimento foi registrado com sucesso.",
    });
  };

  return (
    <div className="container py-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Atendimento RH</h1>
          <p className="text-muted-foreground">
            Registre e acompanhe os atendimentos aos funcionários.
          </p>
        </div>
        <Button
          className="mt-4 md:mt-0"
          onClick={() => setActiveTab("new")}
          disabled={activeTab === "new"}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Atendimento
        </Button>
      </div>

      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">Lista de Atendimentos</TabsTrigger>
            <TabsTrigger value="new">Novo Atendimento</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <CardTitle>Atendimentos</CardTitle>
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="relative">
                      <FileSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Buscar atendimentos..."
                        className="pl-8 w-full md:w-auto"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => setStatusFilter(value as HRAttendanceFilterStatus)}
                    >
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filtrar por status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="in_progress">Em Andamento</SelectItem>
                        <SelectItem value="concluded">Concluídos</SelectItem>
                        <SelectItem value="cancelled">Cancelados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AttendanceList
                  attendances={filteredAttendances}
                  isLoading={isLoading}
                  onStatusChange={handleStatusChange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle>Novo Atendimento</CardTitle>
              </CardHeader>
              <CardContent>
                <AttendanceForm
                  services={services}
                  onAttendanceCreated={handleAttendanceCreated}
                  currentUser={user}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <AttendanceStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
