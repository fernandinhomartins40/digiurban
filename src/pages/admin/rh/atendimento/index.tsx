
import React, { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { DataTable } from "@/components/data-table/data-table";
import { HRAttendance, HRAttendanceStatus, HRService } from "@/types/hr";
import { 
  fetchAttendances, 
  fetchAttendancesByStatus,
  updateAttendanceStatus 
} from "@/services/administration/hr/attendances";
import { fetchServices } from "@/services/administration/hr/services";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AttendanceStats } from "@/components/administracao/rh/attendance/AttendanceStats";
import { AttendanceForm } from "@/components/administracao/rh/attendance/AttendanceForm";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useApiMutation } from "@/lib/hooks"; // Fixed import
import AttendanceColumnDef from "@/components/administracao/rh/attendance/AttendanceColumnDef";

export default function HRAttendancePage() {
  const [activeTab, setActiveTab] = useState<HRAttendanceFilterStatus>("all");
  const [attendances, setAttendances] = useState<HRAttendance[]>([]);
  const [services, setServices] = useState<HRService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewAttendanceDialog, setShowNewAttendanceDialog] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    concluded: 0,
    cancelled: 0
  });

  // Load attendance data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Get services first
        const servicesResponse = await fetchServices();
        if (servicesResponse.data) {
          setServices(servicesResponse.data);
        }

        // Get attendance data based on active tab
        let attendancesResponse;
        if (activeTab === 'all') {
          attendancesResponse = await fetchAttendances();
        } else {
          attendancesResponse = await fetchAttendancesByStatus(activeTab as HRAttendanceStatus);
        }

        if (attendancesResponse.data) {
          setAttendances(attendancesResponse.data);
        }

        // Calculate stats
        const allAttendances = await fetchAttendances();
        if (allAttendances.data) {
          setStats({
            total: allAttendances.data.length,
            inProgress: allAttendances.data.filter(a => a.status === 'in_progress').length,
            concluded: allAttendances.data.filter(a => a.status === 'concluded').length,
            cancelled: allAttendances.data.filter(a => a.status === 'cancelled').length
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [activeTab]);

  // Update attendance status mutation
  const { mutate: updateStatus, isLoading: isUpdating } = useApiMutation(
    async (data: { id: string; status: HRAttendanceStatus; }) => {
      return await updateAttendanceStatus(data.id, data.status);
    },
    {
      onSuccess: () => {
        toast({
          title: "Sucesso",
          description: "Status do atendimento atualizado com sucesso.",
        });
        
        // Reload data after update
        refreshData();
      },
      invalidateQueries: ['attendances']
    }
  );

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as HRAttendanceFilterStatus);
  };

  // Refresh data after changes
  const refreshData = async () => {
    setIsLoading(true);

    try {
      // Refresh services
      const servicesResponse = await fetchServices();
      if (servicesResponse.data) {
        setServices(servicesResponse.data);
      }

      // Refresh attendances based on current tab
      let attendancesResponse;
      if (activeTab === 'all') {
        attendancesResponse = await fetchAttendances();
      } else {
        attendancesResponse = await fetchAttendancesByStatus(activeTab as HRAttendanceStatus);
      }

      if (attendancesResponse.data) {
        setAttendances(attendancesResponse.data);
      }

      // Update stats
      const allAttendances = await fetchAttendances();
      if (allAttendances.data) {
        setStats({
          total: allAttendances.data.length,
          inProgress: allAttendances.data.filter(a => a.status === 'in_progress').length,
          concluded: allAttendances.data.filter(a => a.status === 'concluded').length,
          cancelled: allAttendances.data.filter(a => a.status === 'cancelled').length
        });
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os dados.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle new attendance creation
  const handleAttendanceCreated = () => {
    setShowNewAttendanceDialog(false);
    refreshData();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Atendimentos RH</h1>
          <p className="text-muted-foreground">
            Gerencie os atendimentos de funcionários realizados pelo RH
          </p>
        </div>
        <Button onClick={() => setShowNewAttendanceDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Atendimento
        </Button>
      </div>

      <AttendanceStats stats={stats} />

      <Card>
        <CardHeader>
          <CardTitle>Atendimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="in_progress">Em Andamento</TabsTrigger>
              <TabsTrigger value="concluded">Concluídos</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <DataTable 
                columns={AttendanceColumnDef}
                data={attendances}
                isLoading={isLoading}
                meta={{
                  handleUpdateStatus: (id: string, status: HRAttendanceStatus) => {
                    updateStatus({ id, status });
                  }
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={showNewAttendanceDialog} onOpenChange={setShowNewAttendanceDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Registrar Novo Atendimento</h2>
          <AttendanceForm
            services={services || []}
            onSuccess={handleAttendanceCreated}
            onCancel={() => setShowNewAttendanceDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Extend HRAttendanceStatus with 'all' for filtering
type HRAttendanceFilterStatus = HRAttendanceStatus | 'all';
