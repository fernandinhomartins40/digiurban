
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { AdminUser } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

interface UseUserOperationsProps {
  users: AdminUser[];
  setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  fetchAdminUsers: () => Promise<void>;
}

export function useUserOperations({ users, setUsers, fetchAdminUsers }: UseUserOperationsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});

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
      setIsLoading({...isLoading, [userId]: true});
      
      // Get current auth session to include in the request
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        throw new Error("Você precisa estar autenticado para realizar esta operação");
      }
      
      // Call the edge function to delete the user
      const { data, error } = await supabase.functions.invoke('admin-user-operations', {
        body: { 
          operation: 'deleteUser',
          userId
        }
      });
      
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
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
    } finally {
      setIsLoading(prev => {
        const newState = {...prev};
        delete newState[userId];
        return newState;
      });
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      setIsLoading({...isLoading, [`reset_${userId}`]: true});
      
      // Call the edge function to reset the password
      const { data, error } = await supabase.functions.invoke('admin-user-operations', {
        body: { 
          operation: 'resetPassword',
          userId
        }
      });
      
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
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
    } finally {
      setIsLoading(prev => {
        const newState = {...prev};
        delete newState[`reset_${userId}`];
        return newState;
      });
    }
  };

  return {
    isFormOpen,
    setIsFormOpen,
    editingUser,
    isLoading,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    handleResetPassword
  };
}
