
import React, { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/auth/useAuth";
import { HRAttendance, HRAttendanceCreate, HRAttendanceStatus, HRService } from "@/types/hr";
import { useApiQuery } from "@/lib/hooks/useApiQuery";
import { useApiMutation } from "@/lib/hooks/useApiMutation";
import {
  fetchAttendances,
  fetchAttendancesByEmployee,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from "@/services/administration/hr/attendances";
import { fetchServices } from "@/services/administration/hr/services";
import AttendanceList from "@/components/administracao/rh/attendance/AttendanceList";
import AttendanceForm from "@/components/administracao/rh/attendance/AttendanceForm";
import AttendanceDetail from "@/components/administracao/rh/attendance/AttendanceDetail";
import AttendanceFilter from "@/components/administracao/rh/attendance/AttendanceFilter";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay } from "date-fns";

export default function HRAttendancePage() {
  const { user } = useAuth();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<HRAttendance | null>(null);
  const [viewingAttendance, setViewingAttendance] = useState<HRAttendance | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filters, setFilters] = useState<{
    employeeName?: string;
    serviceId?: string;
    status?: HRAttendanceStatus;
    startDate?: Date;
    endDate?: Date;
  }>({});

  // Fetch all admin profiles (employees)
  const {
    data: employees = [],
    isLoading: isLoadingEmployees,
    refetch: refetchEmployees,
  } = useApiQuery(
    ["admin-profiles"],
    async () => {
      const { data, error } = await supabase
        .from("admin_profiles")
        .select("id, name, email")
        .order("name");

      if (error) throw error;
      return data;
    },
    {
      enabled: true,
    }
  );

  // Fetch services
  const {
    data: services = [],
    isLoading: isLoadingServices,
  } = useApiQuery(
    ["hr-services"],
    async () => {
      const response = await fetchServices();
      return response.data || [];
    },
    {
      enabled: true,
    }
  );

  // Build query parameters based on filters
  const queryParams = React.useMemo(() => {
    const params: any = {
      orderBy: { column: "attendance_date", ascending: false },
    };

    if (filters) {
      params.filters = {};

      if (filters.serviceId) params.filters.serviceId = filters.serviceId;
      if (filters.status) params.filters.status = filters.status;
      if (filters.startDate) params.filters.startDate = startOfDay(filters.startDate);
      if (filters.endDate) params.filters.endDate = endOfDay(filters.endDate);
    }

    return params;
  }, [filters]);

  // Fetch attendances based on filters
  const {
    data: attendances = [],
    isLoading: isLoadingAttendances,
    refetch: refetchAttendances,
  } = useApiQuery(
    ["hr-attendances", JSON.stringify(queryParams)],
    async () => {
      // If we have an employee name filter, we need to find the employee ID first
      let employeeId: string | undefined = undefined;
      
      if (filters.employeeName) {
        const matchingEmployees = employees.filter((emp: any) =>
          emp.name.toLowerCase().includes(filters.employeeName?.toLowerCase() || "")
        );
        
        if (matchingEmployees.length > 0) {
          // If we find an exact match, use that. Otherwise use the first match.
          const exactMatch = matchingEmployees.find(
            (emp: any) => emp.name.toLowerCase() === filters.employeeName?.toLowerCase()
          );
          
          employeeId = exactMatch ? exactMatch.id : matchingEmployees[0].id;
        }
      }
      
      // If filtering by employee (either by name/id or by selection)
      const effectiveEmployeeId = employeeId || selectedEmployeeId;
      
      let response;
      if (effectiveEmployeeId) {
        response = await fetchAttendancesByEmployee(effectiveEmployeeId, queryParams);
      } else {
        response = await fetchAttendances(queryParams);
      }
      
      return response.data || [];
    },
    {
      enabled: true,
    }
  );

  // Fetch employee-specific attendances for history
  const {
    data: employeeHistory = [],
    refetch: refetchHistory,
  } = useApiQuery(
    ["hr-employee-history", viewingAttendance?.employeeId],
    async () => {
      if (!viewingAttendance?.employeeId) return [];
      
      const response = await fetchAttendancesByEmployee(
        viewingAttendance.employeeId,
        { orderBy: { column: "attendance_date", ascending: false } }
      );
      
      return response.data || [];
    },
    {
      enabled: !!viewingAttendance?.employeeId,
    }
  );

  // Create attendance mutation
  const createAttendanceMutation = useApiMutation<HRAttendance, HRAttendanceCreate>(
    "createAttendance",
    (data) => createAttendance(data),
    {
      onSuccess: () => {
        toast({
          title: "Atendimento registrado",
          description: "O atendimento foi registrado com sucesso.",
        });
        setShowForm(false);
        refetchAttendances();
      },
      onError: (error) => {
        console.error("Error creating attendance:", error);
        toast({
          title: "Erro ao registrar atendimento",
          description: "Ocorreu um erro ao tentar registrar o atendimento.",
          variant: "destructive",
        });
      },
    }
  );

  // Update attendance mutation
  const updateAttendanceMutation = useApiMutation<
    HRAttendance,
    { id: string; data: HRAttendanceCreate }
  >(
    "updateAttendance",
    ({ id, data }) => updateAttendance(id, data),
    {
      onSuccess: () => {
        toast({
          title: "Atendimento atualizado",
          description: "O atendimento foi atualizado com sucesso.",
        });
        setEditingAttendance(null);
        setShowForm(false);
        refetchAttendances();
        if (selectedEmployeeId) {
          refetchHistory();
        }
      },
      onError: (error) => {
        console.error("Error updating attendance:", error);
        toast({
          title: "Erro ao atualizar atendimento",
          description: "Ocorreu um erro ao tentar atualizar o atendimento.",
          variant: "destructive",
        });
      },
    }
  );

  // Delete attendance mutation
  const deleteAttendanceMutation = useApiMutation<null, string>(
    "deleteAttendance",
    (id) => deleteAttendance(id),
    {
      onSuccess: () => {
        toast({
          title: "Atendimento excluído",
          description: "O atendimento foi excluído com sucesso.",
        });
        refetchAttendances();
        if (selectedEmployeeId) {
          refetchHistory();
        }
      },
      onError: (error) => {
        console.error("Error deleting attendance:", error);
        toast({
          title: "Erro ao excluir atendimento",
          description: "Ocorreu um erro ao tentar excluir o atendimento.",
          variant: "destructive",
        });
      },
    }
  );

  // Handle creating a new attendance
  const handleCreateAttendance = (data: HRAttendanceCreate) => {
    createAttendanceMutation.mutate({
      ...data,
      attendedBy: user?.id || "",
    });
  };

  // Handle updating an attendance
  const handleUpdateAttendance = (data: HRAttendanceCreate) => {
    if (!editingAttendance) return;
    
    updateAttendanceMutation.mutate({
      id: editingAttendance.id,
      data,
    });
  };

  // Handle deleting an attendance
  const handleDeleteAttendance = (id: string) => {
    deleteAttendanceMutation.mutate(id);
  };

  // Handle viewing attendance details
  const handleViewAttendance = (attendance: HRAttendance) => {
    setViewingAttendance(attendance);
    setIsDetailOpen(true);
  };

  // Handle editing an attendance
  const handleEditAttendance = (attendance: HRAttendance) => {
    setEditingAttendance(attendance);
    setShowForm(true);
  };

  // Handle form submit based on whether we're editing or creating
  const handleFormSubmit = (data: HRAttendanceCreate) => {
    if (editingAttendance) {
      handleUpdateAttendance(data);
    } else {
      handleCreateAttendance(data);
    }
  };

  // Handle filter changes
  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({});
    setSelectedEmployeeId(null);
  };

  // Check if data is loading
  const isLoading = isLoadingAttendances || isLoadingEmployees || isLoadingServices;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Atendimento RH</h1>
          <p className="text-muted-foreground">
            Gerencie os atendimentos realizados para servidores.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Atendimento
          </Button>
        )}
        {showForm && (
          <Button variant="outline" onClick={() => {
            setShowForm(false);
            setEditingAttendance(null);
          }}>
            Cancelar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <AttendanceFilter
            onFilter={handleFilter}
            onReset={handleResetFilters}
            services={services as HRService[]}
            isLoading={isLoading}
          />
        </div>

        <div className="md:col-span-2">
          {showForm ? (
            <AttendanceForm
              initialData={editingAttendance || undefined}
              onSubmit={handleFormSubmit}
              employees={employees}
              isLoading={isLoading}
            />
          ) : (
            <AttendanceList
              attendances={attendances}
              isLoading={isLoading}
              onView={handleViewAttendance}
              onEdit={handleEditAttendance}
              onDelete={handleDeleteAttendance}
            />
          )}
        </div>
      </div>

      {/* Attendance details dialog */}
      <AttendanceDetail
        attendance={viewingAttendance}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setViewingAttendance(null);
        }}
        employeeHistory={employeeHistory.filter(
          (item) => item.id !== viewingAttendance?.id
        )}
      />
    </div>
  );
}
