
import { toast } from "@/hooks/use-toast";
import { AdminUser } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface UseUserSubmitProps {
  users: AdminUser[];
  setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
}

export function useUserSubmit({ users, setUsers }: UseUserSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitUser = async (userData: any): Promise<void> => {
    try {
      setIsSubmitting(true);
      
      const editingUser = users.find(u => u.id === userData.id);
      
      if (editingUser) {
        // Update existing user through Edge Function
        const { data, error } = await supabase.functions.invoke('admin-user-operations', {
          body: { 
            operation: 'updateUser',
            userData
          }
        });
        
        if (error) throw error;
        if (data.error) throw new Error(data.error);
        
        // Update local state
        const { permissions, ...userDataWithoutPermissions } = userData;
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
        // Create new user through Edge Function
        const { data, error } = await supabase.functions.invoke('admin-user-operations', {
          body: { 
            operation: 'createUser',
            userData
          }
        });
        
        if (error) throw error;
        if (data.error) throw new Error(data.error);
        
        // Add new user to state
        setUsers(prevUsers => [...prevUsers, data.user]);
        
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmitUser, isSubmitting };
}
