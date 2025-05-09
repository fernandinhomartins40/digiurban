
import { toast } from "@/hooks/use-toast";
import { AdminUser } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { sanitizeObject } from "@/lib/security/inputSanitization";
import { AuditLogger, AuditOperationType } from "@/lib/security/auditLogger";
import { useCSRFToken } from "@/hooks/useSecurityHeaders";

interface UseUserSubmitProps {
  users: AdminUser[];
  setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
}

export function useUserSubmit({ users, setUsers }: UseUserSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getCSRFToken } = useCSRFToken();

  const handleSubmitUser = async (userData: any): Promise<void> => {
    try {
      setIsSubmitting(true);
      
      // Sanitize input data to prevent XSS
      const sanitizedUserData = sanitizeObject(userData);
      
      // Add CSRF token
      const csrfToken = getCSRFToken();
      if (!csrfToken) {
        throw new Error("Falha de segurança: Token CSRF não encontrado.");
      }
      
      const editingUser = users.find(u => u.id === userData.id);
      
      if (editingUser) {
        // Update existing user through Edge Function
        const { data, error } = await supabase.functions.invoke('admin-user-operations', {
          body: { 
            operation: 'updateUser',
            userData: sanitizedUserData,
            _csrf: csrfToken
          }
        });
        
        if (error) throw error;
        if (data.error) throw new Error(data.error);
        
        // Update local state
        const { permissions, ...userDataWithoutPermissions } = sanitizedUserData;
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === editingUser.id 
              ? {...u, ...userDataWithoutPermissions}
              : u
          )
        );
        
        // Log audit event
        // Fix: use await with an async IIFE to properly handle the Promise<string>
        const userId = await (async () => {
          const { data } = await supabase.auth.getUser();
          return data.user?.id || 'unknown';
        })();
        
        await AuditLogger.log({
          operationType: AuditOperationType.USER_UPDATE,
          userId,
          targetId: editingUser.id,
          details: {
            updatedFields: Object.keys(userDataWithoutPermissions),
            department: userDataWithoutPermissions.department
          }
        });
        
        toast({
          title: "Usuário atualizado",
          description: "As informações do usuário foram atualizadas com sucesso."
        });
      } else {
        // Create new user through Edge Function
        const { data, error } = await supabase.functions.invoke('admin-user-operations', {
          body: { 
            operation: 'createUser',
            userData: sanitizedUserData,
            _csrf: csrfToken
          }
        });
        
        if (error) throw error;
        if (data.error) throw new Error(data.error);
        
        // Add new user to state
        setUsers(prevUsers => [...prevUsers, data.user]);
        
        // Log audit event
        // Fix: use await with an async IIFE to properly handle the Promise<string>
        const userId = await (async () => {
          const { data } = await supabase.auth.getUser();
          return data.user?.id || 'unknown';
        })();
        
        await AuditLogger.log({
          operationType: AuditOperationType.USER_CREATE,
          userId,
          targetId: data.user.id,
          details: {
            role: sanitizedUserData.role,
            department: sanitizedUserData.department
          }
        });
        
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
