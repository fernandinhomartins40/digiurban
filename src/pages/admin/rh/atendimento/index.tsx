
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiMutation, useApiQuery } from "@/lib/hooks";
import { 
  fetchAttendances, 
  fetchAttendancesByStatus,
  updateAttendanceStatus
} from "@/services/administration/hr/attendances";
import { fetchServices } from "@/services/administration/hr/services";
import { HRAttendance, HRAttendanceStatus, HRService } from "@/types/hr";
import { AttendanceColumnDef } from "@/components/administracao/rh/attendance/AttendanceColumnDef";
import AttendanceForm from "@/components/administracao/rh/attendance/AttendanceForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<HRAttendanceStatus | 'all'>('all');
  const [showNewAttendanceForm, setShowNewAttendanceForm] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<HRAttendance | null>(null);

  // Fetch attendances based on active tab
  const { 
    data: attendances,
    isLoading,
    refetch: refetchAttendances
  } = useApiQuery(
    ['attendances', activeTab],
    async () => {
      if (activeTab === 'all') {
        return fetchAttendances();
      } else {
        return fetchAttendancesByStatus(activeTab);
      }
    }
  );

  // Fetch services for the form
  const { data: services = { data: [] } } = useApiQuery(
    ['services'],
    fetchServices
  );

  // Handle status change mutation
  const { mutate: changeStatus } = useApiMutation(
    async (data: { id: string; status: HRAttendanceStatus }) => {
      return updateAttendanceStatus(data.id, data.status);
    },
    {
      onSuccess: () => {
        toast({
          title: "Status atualizado",
          description: "Status do atendimento atualizado com sucesso.",
        });
        refetchAttendances();
      },
      onError: (error) => {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao atualizar o status.",
          variant: "destructive",
        });
        console.error("Error updating status:", error);
      }
    }
  );

  // Handle attendance creation/update success
  const handleAttendanceSuccess = () => {
    setShowNewAttendanceForm(false);
    setSelectedAttendance(null);
    refetchAttendances();
    toast({
      title: "Sucesso",
      description: "Atendimento salvo com sucesso.",
    });
  };

  const handleEditAttendance = (attendance: HRAttendance) => {
    setSelectedAttendance(attendance);
    setShowNewAttendanceForm(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Atendimentos RH</h1>
          <p className="text-muted-foreground">
            Gerencie os atendimentos aos funcionários
          </p>
        </div>
        <Button onClick={() => setShowNewAttendanceForm(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Atendimento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atendimentos</CardTitle>
          <Tabs 
            defaultValue="all" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as HRAttendanceStatus | 'all')}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-[400px]">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="in_progress">Em Andamento</TabsTrigger>
              <TabsTrigger value="concluded">Concluídos</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={AttendanceColumnDef}
            data={attendances?.data || []}
            isLoading={isLoading}
            meta={{
              onStatusChange: (id: string, status: HRAttendanceStatus) => changeStatus({ id, status }),
              onEditAttendance: handleEditAttendance
            }}
          />
        </CardContent>
      </Card>

      <Dialog 
        open={showNewAttendanceForm} 
        onOpenChange={setShowNewAttendanceForm}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedAttendance ? "Editar Atendimento" : "Novo Atendimento"}
            </DialogTitle>
          </DialogHeader>
          <AttendanceForm
            services={services?.data || []}
            initialData={selectedAttendance}
            onSuccess={handleAttendanceSuccess}
            onCancel={() => {
              setShowNewAttendanceForm(false);
              setSelectedAttendance(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
