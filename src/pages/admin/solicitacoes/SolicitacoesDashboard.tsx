
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUnifiedRequests } from "@/hooks/useUnifiedRequests";
import { RequestStats } from "@/components/solicitacoes/RequestStats";
import { RequestManagement } from "@/components/unified-requests/RequestManagement";
import { UnifiedRequest, RequestStatus } from "@/types/requests";

export default function SolicitacoesDashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "prefeito";
  const userDepartment = user?.department;
  
  // Get the unified requests hook
  const {
    requests,
    setDepartmentFilter,
  } = useUnifiedRequests();
  
  // Set the department filter if user is not an admin
  useEffect(() => {
    if (!isAdmin && userDepartment) {
      setDepartmentFilter(userDepartment);
    }
  }, [isAdmin, userDepartment, setDepartmentFilter]);
  
  // Calculate stats for the dashboard
  const totalRequests = requests?.length || 0;
  const openRequests = requests?.filter(req => req.status === "open").length || 0;
  const inProgressRequests = requests?.filter(req => req.status === "in_progress").length || 0;
  const completedRequests = requests?.filter(req => req.status === "completed").length || 0;
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Central de Solicitações</h1>
        <p className="text-muted-foreground">
          {isAdmin 
            ? "Visualize e gerencie todas as solicitações do sistema." 
            : `Visualize e gerencie as solicitações do departamento de ${userDepartment || "seu departamento"}.`}
        </p>
      </div>
      
      <RequestStats 
        totalCount={totalRequests}
        openCount={openRequests}
        inProgressCount={inProgressRequests}
        completedCount={completedRequests}
      />
      
      <RequestManagement 
        title="Solicitações"
        description={isAdmin 
          ? "Gerencie todas as solicitações" 
          : `Solicitações do departamento de ${userDepartment || "seu departamento"}`}
        departmentFilter={!isAdmin ? userDepartment : undefined}
        showNewRequestButton={true}
        allowForwarding={isAdmin} // Only admins can forward requests
      />
    </div>
  );
}
