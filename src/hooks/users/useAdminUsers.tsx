
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { AdminUser, AdminPermission } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

export function useAdminUsers() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);

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

  return {
    users,
    setUsers,
    isLoading,
    fetchAdminUsers
  };
}
