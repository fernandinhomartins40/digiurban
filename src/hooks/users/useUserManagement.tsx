
import { useState } from "react";
import { useAdminUsers } from "./useAdminUsers";
import { useDepartmentStatistics } from "./useDepartmentStatistics";
import { useUserOperations } from "./useUserOperations";
import { useUserSubmit } from "./useUserSubmit";
import { useUserFilters, UserFilterValues } from "./useUserFilters";

// Use the "type" keyword when re-exporting types with isolatedModules enabled
export type { UserFilterValues } from "./useUserFilters";

export function useUserManagement() {
  const { users, setUsers, isLoading, fetchAdminUsers } = useAdminUsers();
  const { filters, setFilters } = useUserFilters();
  const { departmentStats, departments, departmentChartData } = useDepartmentStatistics(users);
  const { 
    isFormOpen, 
    setIsFormOpen, 
    editingUser, 
    handleAddUser, 
    handleEditUser, 
    handleDeleteUser, 
    handleResetPassword 
  } = useUserOperations({ users, setUsers, fetchAdminUsers });
  const { handleSubmitUser } = useUserSubmit({ users, setUsers });

  // Sample access logs - in a real app, these would come from the database
  const [accessLogs] = useState<any[]>([
    {
      id: "1",
      userId: "1",
      userName: "João Silva",
      actionType: "login",
      timestamp: "2023-05-05T10:30:00",
      details: "Login via email/senha",
    },
    {
      id: "2",
      userId: "2",
      userName: "Maria Souza",
      actionType: "update",
      timestamp: "2023-05-05T11:45:00",
      details: "Atualização de permissões para o usuário Carlos Santos",
    },
    {
      id: "3",
      userId: "3",
      userName: "Ana Pereira",
      actionType: "create",
      timestamp: "2023-05-04T14:20:00",
      details: "Criação de novo usuário administrativo",
    },
    {
      id: "4",
      userId: "1",
      userName: "João Silva",
      actionType: "logout",
      timestamp: "2023-05-04T17:00:00",
    },
  ]);

  return {
    users,
    isLoading,
    isFormOpen,
    setIsFormOpen,
    editingUser,
    filters,
    setFilters,
    departments,
    departmentStats,
    departmentChartData,
    accessLogs,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    handleResetPassword,
    handleSubmitUser,
    fetchAdminUsers
  };
}
