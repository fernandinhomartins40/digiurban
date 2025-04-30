import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { NavigateFunction } from "react-router-dom";
import { User } from "@/types/auth";
import { Session } from "@supabase/supabase-js";

/**
 * Core authentication methods implementation
 */
export function createAuthActions(
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
      console.log(`Attempting login for ${email} as ${userType}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error from Supabase:", error);
        throw error;
      }
      
      console.log("Login successful, session:", data.session);
      
      // Don't rely solely on auth state listener for redirection
      // The auth state listener will handle setting the session state
      // But we'll keep the loading state until we're confident the listener has fired
      setTimeout(() => {
        console.log("Login timeout completed, resetting loading state");
        setIsLoading(false);
      }, 2000);
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

  return {
    login,
    register,
    logout,
  };
}
