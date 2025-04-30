
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { NavigateFunction } from "react-router-dom";
import { User } from "@/types/auth";
import { Session } from "@supabase/supabase-js";

/**
 * Hook providing authentication methods
 */
export function useAuthMethods(
  user: User | null,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setSession: React.Dispatch<React.SetStateAction<Session | null>>,
  setUserType: React.Dispatch<React.SetStateAction<"admin" | "citizen" | null>>,
  navigate: NavigateFunction
) {
  // Clear auth state utility
  const clearAuthState = () => {
    setUser(null);
    setSession(null);
    setUserType(null);
  };

  const login = async (email: string, password: string, userType: "admin" | "citizen") => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Wait a short time for the auth state to update
      // This helps prevent redirect loops
      setTimeout(() => {
        if (!user) {
          setIsLoading(false);
        }
      }, 3000);
    } catch (error: any) {
      console.error("Login error:", error.message);
      toast({
        title: "Erro no login",
        description: error.message || "Verifique suas credenciais e tente novamente",
        variant: "destructive",
      });
      
      // CRITICAL: Always set loading to false on error
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (userData: any, userType: "admin" | "citizen") => {
    try {
      setIsLoading(true);
      
      // Add user_type to metadata
      const metadata = {
        ...userData,
        user_type: userType,
      };
      
      // Remove password from metadata
      const { password, confirmPassword, ...userMetadata } = metadata;
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: userMetadata,
        }
      });

      if (error) throw error;

      toast({
        title: "Cadastro realizado",
        description: "Sua conta foi criada com sucesso!",
      });
    } catch (error: any) {
      console.error("Registration error:", error.message);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Não foi possível completar o cadastro",
        variant: "destructive",
      });
      
      // Make sure to set loading to false on error
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      clearAuthState();
      navigate("/login", { replace: true });
    } catch (error: any) {
      console.error("Logout error:", error.message);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível encerrar sua sessão",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha",
      });
    } catch (error: any) {
      console.error("Reset password error:", error.message);
      toast({
        title: "Erro ao resetar senha",
        description: error.message || "Não foi possível enviar o email de recuperação",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso",
      });
    } catch (error: any) {
      console.error("Update password error:", error.message);
      toast({
        title: "Erro ao atualizar senha",
        description: error.message || "Não foi possível atualizar sua senha",
        variant: "destructive",
      });
      throw error;
    }
  };

  const hasPermission = (moduleId: string, action: "create" | "read" | "update" | "delete") => {
    if (!user || user.role === "citizen") return false;
    
    // Prefeito has all permissions
    if (user.role === "prefeito") return true;
    
    // Check specific permissions
    return user.permissions.some(
      (permission) => 
        (permission.moduleId === "all" || permission.moduleId === moduleId) && 
        permission[action]
    );
  };

  return {
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    hasPermission,
  };
}
