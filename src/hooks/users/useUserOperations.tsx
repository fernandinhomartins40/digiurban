
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { AdminUser, AdminPermission } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

interface UseUserOperationsProps {
  users: AdminUser[];
  setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  fetchAdminUsers: () => Promise<void>;
}

export function useUserOperations({ users, setUsers, fetchAdminUsers }: UseUserOperationsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | undefined>(undefined);

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

  return {
    isFormOpen,
    setIsFormOpen,
    editingUser,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    handleResetPassword
  };
}
