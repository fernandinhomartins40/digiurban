
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { NavigateFunction } from "react-router-dom";
import { User } from "@/types/auth";
import { Session } from "@supabase/supabase-js";
import { AuthError } from "@supabase/supabase-js";
import { cleanupAuthState } from "@/lib/security/sessionManager";

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
    
    // Clean up auth storage items
    cleanupAuthState();
  };

  const login = async (email: string, password: string, userType: "admin" | "citizen") => {
    try {
      setIsLoading(true);
      console.log(`Attempting login for ${email} as ${userType}`);
      
      // Clean up any existing auth state first
      cleanupAuthState();
      
      // Try a global sign out first to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Pre-login signout error (non-critical):", err);
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        handleAuthError(error);
        return;
      }
      
      console.log("Login successful, session:", data.session);
      
      // The auth state listener should handle setting user state
      // but we'll also set it directly here to ensure immediate feedback
      setSession(data.session);
      
      // If after 3 seconds we're still loading, reset to prevent UI lockup
      const safetyTimeout = setTimeout(() => {
        console.log("Safety timeout triggered - resetting loading state");
        setIsLoading(false);
        
        // Force navigation as a fallback - ensure dashboard route exists!
        if (data.session) {
          const redirectPath = userType === "admin" ? "/admin/dashboard" : "/citizen/dashboard";
          console.log(`Forcing redirect to ${redirectPath} after timeout`);
          // Use location.href for a full page refresh to ensure clean slate
          window.location.href = redirectPath;
        }
      }, 3000);
      
      // Return the safety timeout so we can clear it if auth state changes properly
      return safetyTimeout;
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  /**
   * Handle authentication errors with appropriate messages
   */
  const handleAuthError = (error: AuthError | any) => {
    console.error("Auth error:", error.message);
    
    // Determine specific error message based on error code
    let errorMessage = "Ocorreu um erro durante a autenticação.";
    
    if (error.status === 400) {
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email ou senha inválidos. Verifique suas credenciais.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
      }
    } else if (error.status === 429) {
      errorMessage = "Muitas tentativas. Tente novamente mais tarde.";
    }
    
    toast({
      title: "Erro no login",
      description: errorMessage,
      variant: "destructive",
    });
    
    // Always reset loading state on error
    setIsLoading(false);
  };

  const register = async (userData: any, userType: "admin" | "citizen") => {
    try {
      setIsLoading(true);
      
      // Clean up any existing auth state first
      cleanupAuthState();
      
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
          emailRedirectTo: window.location.origin + "/login"
        }
      });

      if (error) {
        handleAuthError(error);
        return;
      }

      toast({
        title: "Cadastro realizado",
        description: "Sua conta foi criada com sucesso!",
      });
      
      // Registration succeeded but user might need email verification
      if (data?.session) {
        console.log("User registered and logged in automatically");
      } else {
        console.log("User registered, email verification may be required");
        setIsLoading(false);
        navigate("/login", { replace: true });
      }
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // First clean up auth state
      clearAuthState();
      
      // Then sign out with global scope
      await supabase.auth.signOut({ scope: 'global' });
      
      // Navigate to login and force page reload for clean state
      window.location.href = "/login";
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
    clearAuthState,
  };
}
