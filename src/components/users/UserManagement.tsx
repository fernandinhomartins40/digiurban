
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Info } from "lucide-react";
import { UserTabs } from "@/components/users/UserTabs";
import { UserFormSheet } from "@/components/users/UserFormSheet";
import { UserRolesManagement } from "@/components/users/UserRolesManagement";
import { AccessLogTable } from "@/components/users/AccessLogTable";
import { UsersTabContent } from "@/components/users/tabs/UsersTabContent";
import { AnalyticsTabContent } from "@/components/users/tabs/AnalyticsTabContent";
import { UserManagementHeader } from "@/components/users/UserManagementHeader";
import { useUserManagement } from "@/hooks/users/useUserManagement";
import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export default function UserManagement() {
  const { user } = useAuth();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);

  // Get current tab from URL query params
  const params = new URLSearchParams(location.search);
  const defaultTab = params.get("tab") || "users";
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  // Use custom hook for user management
  const {
    users,
    isLoading: usersLoading,
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
    fetchAdminUsers,
    actionLoading,
    isSubmitting
  } = useUserManagement();

  // Check authorization
  React.useEffect(() => {
    const checkAuthorization = async () => {
      if (user) {
        // Only prefeito user is allowed to access this page
        setIsAuthorized(user.role === 'prefeito');
      } else {
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, [user]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Verificando permissões...</span>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>
            Somente o Prefeito tem acesso a este módulo.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando usuários...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserManagementHeader 
        onAddUser={handleAddUser} 
        onRefresh={fetchAdminUsers} 
      />

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Info size={20} className="text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Gestão de Usuários</h3>
              <p className="text-sm text-muted-foreground">
                Aqui você pode gerenciar os usuários administrativos do sistema. Apenas o Prefeito tem acesso a este módulo.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <UserTabs activeTab={activeTab} onTabChange={setActiveTab}>
        <TabsContent value="users" className="space-y-4">
          <UsersTabContent 
            users={users}
            filters={filters}
            setFilters={setFilters}
            departments={departments}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onResetPassword={handleResetPassword}
            isLoading={usersLoading}
          />
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-4">
          <UserRolesManagement />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsTabContent 
            departmentStats={departmentStats}
            departmentChartData={departmentChartData}
            totalUsers={users.length}
          />
        </TabsContent>
        
        <TabsContent value="logs">
          <AccessLogTable logs={accessLogs} />
        </TabsContent>
      </UserTabs>

      <UserFormSheet
        user={editingUser}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitUser}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
