
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { RequestManagement } from "@/components/unified-requests/RequestManagement";
import { isAdminUser } from "@/types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestStats } from "@/components/requests/RequestStats";
import { useUnifiedRequests } from "@/hooks/useUnifiedRequests";

interface UniversalRequestsDashboardProps {
  departmentFilter?: string;
  useTransition?: (callback: () => void) => void;
  isPending?: boolean;
}

export function UniversalRequestsDashboard({ 
  departmentFilter,
  useTransition,
  isPending = false
}: UniversalRequestsDashboardProps) {
  const { user } = useAuth();
  
  // Extract department from user if not provided
  const effectiveDepartment = departmentFilter || (user && isAdminUser(user) ? user.department : undefined);
  
  const {
    requests,
    isLoading,
    departmentFilter: currentDeptFilter,
    setDepartmentFilter,
  } = useUnifiedRequests();

  // Set department filter automatically based on user's department
  useEffect(() => {
    if (effectiveDepartment && currentDeptFilter !== effectiveDepartment) {
      setDepartmentFilter(effectiveDepartment);
    }
  }, [effectiveDepartment, currentDeptFilter, setDepartmentFilter]);

  if (!user || !isAdminUser(user) || !user.department) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configuração Requerida</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Para usar o Painel Universal de Solicitações, é necessário ser um usuário administrativo
            com departamento configurado.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Stats for department requests
  const openRequests = requests?.filter(r => r.status === 'open')?.length || 0;
  const inProgressRequests = requests?.filter(r => r.status === 'in_progress')?.length || 0;
  const completedRequests = requests?.filter(r => r.status === 'completed')?.length || 0;
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <RequestStats 
          title="Solicitações Abertas"
          value={openRequests}
          description="Aguardando processamento"
          trend={undefined}
          icon="inbox"
          iconColor="text-yellow-500"
        />
        <RequestStats 
          title="Em Andamento"
          value={inProgressRequests}
          description="Sendo processadas"
          trend={undefined}
          icon="loader"
          iconColor="text-blue-500"
        />
        <RequestStats 
          title="Concluídas"
          value={completedRequests}
          description="Processamento finalizado"
          trend={undefined}
          icon="check-circle"
          iconColor="text-green-500"
        />
      </div>

      <RequestManagement 
        title={`Solicitações - ${user.department}`}
        description={`Gerencie as solicitações relacionadas ao departamento ${user.department}`}
        departmentFilter={user.department}
        allowForwarding={true}
        useTransition={useTransition}
        isPending={isPending}
      />
    </div>
  );
}
