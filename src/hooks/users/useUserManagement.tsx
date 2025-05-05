
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import { AdminUser, AdminPermission } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { useAdminUsers } from "./useAdminUsers";

export interface UserFilterValues {
  searchTerm: string;
  department: string | null;
  role: string | null;
  status: string | null;
}

export function useUserManagement() {
  const { users, setUsers, isLoading, fetchAdminUsers } = useAdminUsers();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | undefined>(undefined);
  const [filters, setFilters] = useState<UserFilterValues>({
    searchTerm: "",
    department: null,
    role: null,
    status: null,
  });

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
