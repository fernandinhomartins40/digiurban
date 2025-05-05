
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserFilters, UserFilterValues } from "@/components/users/UserFilters";
import { UserFormDialog } from "@/components/users/UserFormDialog";
import { UserActionMenu } from "@/components/users/UserActionMenu";
import { UserStatsCard } from "@/components/users/UserStatsCard";
import { DepartmentUserStats } from "@/components/users/DepartmentUserStats";
import { AccessLogTable } from "@/components/users/AccessLogTable";
import { AdminUser, AdminPermission } from "@/types/auth";
import { AlertCircle, Loader2, UserPlus, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

export default function UserManagement() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [editingUser, setEditingUser] = useState<AdminUser | undefined>(undefined);
  const [filters, setFilters] = useState<UserFilterValues>({
    searchTerm: "",
    department: null,
    role: null,
    status: null,
  });

  // Sample access logs - in a real app, these would come from the database
  const [accessLogs, setAccessLogs] = useState<any[]>([
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

  // Fetch admin users
  const fetchAdminUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('admin_profiles')
        .select(`
          *,
          admin_permissions(*)
        `)
        .order('name');

      if (error) {
        throw error;
      }

      // Transform data to match our User type
      const transformedUsers: AdminUser[] = data.map((admin: any) => ({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        department: admin.department,
        position: admin.position,
        permissions: admin.admin_permissions.map((permission: any) => ({
          moduleId: permission.module_id,
          create: permission.create_permission,
          read: permission.read_permission,
          update: permission.update_permission,
          delete: permission.delete_permission,
        })),
        createdAt: admin.created_at,
        updatedAt: admin.updated_at
      }));

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários administrativos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  // Filter users based on the filter values
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search term filter
      if (
        filters.searchTerm &&
        !user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !user.email.toLowerCase().includes(filters.searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Department filter
      if (
        filters.department &&
        user.department !== filters.department
      ) {
        return false;
      }

      // Role filter
      if (
        filters.role &&
        user.role !== filters.role
      ) {
        return false;
      }

      return true;
    });
  }, [users, filters]);

  // Department statistics
  const departmentStats = useMemo(() => {
    const deptMap: Record<string, number> = {};
    
    users.forEach(user => {
      if (user.department) {
        deptMap[user.department] = (deptMap[user.department] || 0) + 1;
      }
    });
    
    return Object.entries(deptMap).map(([department, userCount]) => ({
      department,
      userCount,
    }));
  }, [users]);

  // Get unique departments for the filter dropdown
  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    
    users.forEach(user => {
      if (user.department) {
        deptSet.add(user.department);
      }
    });
    
    return Array.from(deptSet);
  }, [users]);

  // Chart data
  const departmentChartData = useMemo(() => {
    return departmentStats.map(stat => ({
      name: stat.department,
      count: stat.userCount
    }));
  }, [departmentStats]);

  // Check if user is allowed to manage users (only prefeito can)
  const isPrefeitoUser = user?.role === "prefeito";

  if (!isPrefeitoUser) {
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

  const handleAddUser = () => {
    setEditingUser(undefined);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Delete user from auth (this will cascade to profiles and permissions)
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      // Update UI state
      setUsers(users.filter(user => user.id !== userId));
      
      toast({
        title: "Usuário removido",
        description: "O usuário foi removido com sucesso."
      });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Erro ao remover usuário",
        description: error.message || "Não foi possível remover o usuário.",
        variant: "destructive"
      });
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      // Get user email
      const userToReset = users.find(u => u.id === userId);
      if (!userToReset) throw new Error("Usuário não encontrado");
      
      const { error } = await supabase.auth.resetPasswordForEmail(userToReset.email, {
        redirectTo: window.location.origin + "/reset-password",
      });
      
      if (error) throw error;
      
      toast({
        title: "Email enviado",
        description: "Email de redefinição de senha enviado com sucesso."
      });
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast({
        title: "Erro ao enviar email",
        description: error.message || "Não foi possível enviar o email de redefinição de senha.",
        variant: "destructive"
      });
    }
  };

  const handleSubmitUser = async (userData: any) => {
    try {
      if (editingUser) {
        // Update existing user
        const { permissions, ...userDataWithoutPermissions } = userData;
        
        // Update profile
        const { error: profileError } = await supabase
          .from('admin_profiles')
          .update({
            name: userData.name,
            email: userData.email,
            department: userData.department,
            position: userData.position,
            role: userData.role,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingUser.id);
          
        if (profileError) throw profileError;
        
        // Update permissions - first delete existing ones
        const { error: deletePermError } = await supabase
          .from('admin_permissions')
          .delete()
          .eq('admin_id', editingUser.id);
          
        if (deletePermError) throw deletePermError;
        
        // Then insert new permissions
        const permissionsToInsert = permissions.map((p: AdminPermission) => ({
          admin_id: editingUser.id,
          module_id: p.moduleId,
          create_permission: p.create,
          read_permission: p.read,
          update_permission: p.update,
          delete_permission: p.delete
        }));
        
        const { error: insertPermError } = await supabase
          .from('admin_permissions')
          .insert(permissionsToInsert);
          
        if (insertPermError) throw insertPermError;
        
        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === editingUser.id 
              ? {...u, ...userDataWithoutPermissions}
              : u
          )
        );
        
        toast({
          title: "Usuário atualizado",
          description: "As informações do usuário foram atualizadas com sucesso."
        });
      } else {
        // Create new user
        const { password, confirmPassword, permissions, ...userMetadata } = userData;
        
        // Register the user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              ...userMetadata,
              user_type: 'admin'
            }
          }
        });
        
        if (authError) throw authError;
        
        if (!authData.user) throw new Error("Erro ao criar usuário");
        
        // Add permissions (handled by trigger for basic user creation)
        for (const permission of permissions) {
          const { error: permError } = await supabase
            .from('admin_permissions')
            .insert({
              admin_id: authData.user.id,
              module_id: permission.moduleId,
              create_permission: permission.create,
              read_permission: permission.read,
              update_permission: permission.update,
              delete_permission: permission.delete
            });
            
          if (permError) throw permError;
        }
        
        // Fetch the newly created user
        const { data: newUser, error: fetchError } = await supabase
          .from('admin_profiles')
          .select('*, admin_permissions(*)')
          .eq('id', authData.user.id)
          .single();
          
        if (fetchError) throw fetchError;
        
        // Transform and add to UI
        const transformedUser: AdminUser = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department,
          position: newUser.position,
          permissions: newUser.admin_permissions.map((p: any) => ({
            moduleId: p.module_id,
            create: p.create_permission,
            read: p.read_permission,
            update: p.update_permission,
            delete: p.delete_permission
          })),
          createdAt: newUser.created_at,
          updatedAt: newUser.updated_at
        };
        
        setUsers(prevUsers => [...prevUsers, transformedUser]);
        
        toast({
          title: "Usuário adicionado",
          description: "O usuário foi adicionado com sucesso."
        });
      }
    } catch (error: any) {
      console.error("Error managing user:", error);
      toast({
        title: `Erro ao ${editingUser ? 'atualizar' : 'adicionar'} usuário`,
        description: error.message || `Não foi possível ${editingUser ? 'atualizar' : 'adicionar'} o usuário.`,
        variant: "destructive"
      });
      throw error; // Re-throw to let the form know there was an error
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando usuários...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários administrativos do sistema e suas permissões.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAdminUsers}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={handleAddUser}>
            <UserPlus className="h-4 w-4 mr-2" />
            {isMobile ? "Adicionar" : "Adicionar Usuário"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="logs">Registros</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <UserFilters 
                onFilterChange={setFilters} 
                departments={departments}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className={isMobile ? "hidden" : ""}>Departamento</TableHead>
                    <TableHead className={isMobile ? "hidden" : ""}>Cargo</TableHead>
                    <TableHead className={isMobile ? "hidden" : ""}>Função</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={isMobile ? 3 : 6} className="text-center py-10">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-muted-foreground">
                            Nenhum usuário encontrado.
                          </p>
                          {(filters.searchTerm || filters.department || filters.role) && (
                            <Button variant="ghost" onClick={() => setFilters({
                              searchTerm: "",
                              department: null,
                              role: null,
                              status: null,
                            })}>
                              Limpar filtros
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className={isMobile ? "hidden" : ""}>{user.department || "-"}</TableCell>
                        <TableCell className={isMobile ? "hidden" : ""}>{user.position || "-"}</TableCell>
                        <TableCell className={isMobile ? "hidden" : ""}>
                          <span className={`px-2 py-1 rounded-md text-xs ${
                            user.role === 'prefeito' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role === 'prefeito' ? 'Prefeito' : 'Administrador'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <UserActionMenu
                            user={user}
                            onEdit={handleEditUser}
                            onDelete={handleDeleteUser}
                            onResetPassword={handleResetPassword}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <UserStatsCard
            totalUsers={users.length}
            activeUsers={users.length} // In a real app, you'd track active users
            departmentStats={departmentStats}
          />
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <DepartmentUserStats 
              departmentData={departmentChartData}
            />
            
            <Card className="col-span-1 lg:col-span-1">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Estatísticas de Permissões</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Distribuição de permissões por módulos:
                </p>
                
                <div className="space-y-4">
                  {[
                    { module: "Administração", read: 15, write: 8, delete: 3 },
                    { module: "Finanças", read: 12, write: 5, delete: 2 },
                    { module: "RH", read: 10, write: 7, delete: 3 },
                  ].map((stat) => (
                    <div key={stat.module} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{stat.module}</span>
                        <span className="text-muted-foreground">
                          {stat.read} usuários com acesso
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${(stat.read / users.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="logs">
          <AccessLogTable logs={accessLogs} />
        </TabsContent>
      </Tabs>

      <UserFormDialog
        user={editingUser}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitUser}
      />
    </div>
  );
}
