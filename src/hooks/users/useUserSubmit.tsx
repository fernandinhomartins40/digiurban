
import { toast } from "@/hooks/use-toast";
import { AdminUser, AdminPermission } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

interface UseUserSubmitProps {
  users: AdminUser[];
  setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
}

export function useUserSubmit({ users, setUsers }: UseUserSubmitProps) {
  const handleSubmitUser = async (userData: any) => {
    try {
      const editingUser = users.find(u => u.id === userData.id);
      
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
        title: `Erro ao ${userData.id ? 'atualizar' : 'adicionar'} usuário`,
        description: error.message || `Não foi possível ${userData.id ? 'atualizar' : 'adicionar'} o usuário.`,
        variant: "destructive"
      });
      throw error; // Re-throw to let the form know there was an error
    }
  };

  return { handleSubmitUser };
}
