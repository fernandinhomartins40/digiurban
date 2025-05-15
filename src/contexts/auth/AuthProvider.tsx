import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth";
import { Session } from "@supabase/supabase-js";
import { fetchUserProfile } from "../authUtils";
import { AuthContextType } from "./types";
import { AuthErrorHandler, AuthLoadingIndicator } from "./AuthErrorHandler";
import { toast } from "@/hooks/use-toast";

// Create Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Add the useAuth hook export here
export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<"admin" | "citizen" | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    console.log("AuthProvider: Initializing auth state");
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log("Auth state change event:", event, "Session:", currentSession?.user?.id);
            
            if (!isMounted) return;
            
            if (event === 'SIGNED_OUT') {
              console.log("User signed out, clearing auth state");
              setUser(null);
              setSession(null);
              setUserType(null);
              setIsLoading(false);
              return;
            }
            
            // Set session immediately to update UI
            if (currentSession) {
              setSession(currentSession);
              
              // Use setTimeout to avoid potential deadlocks with Supabase auth
              setTimeout(async () => {
                if (!isMounted) return;
                
                try {
                  // Set a timeout for profile fetching
                  const profilePromise = fetchUserProfile(currentSession.user.id, setUser, setUserType);
                  
                  const timeoutPromise = new Promise<boolean>((resolve) => {
                    setTimeout(() => resolve(false), 5000);
                  });
                  
                  // Race between profile fetch and timeout
                  const profileFound = await Promise.race([profilePromise, timeoutPromise]);
                  
                  if (!profileFound) {
                    console.warn("Profile fetch timed out or failed, using metadata");
                    
                    // Try to extract user_type from metadata as fallback
                    const metadataUserType = currentSession.user.user_metadata?.user_type;
                    if (metadataUserType) {
                      setUserType(metadataUserType);
                      
                      // Try to create profile in the background
                      fetchUserProfile(currentSession.user.id, setUser, setUserType)
                        .catch(err => console.error("Background profile creation failed:", err));
                    }
                  }
                } catch (error) {
                  console.error("Error handling auth change:", error);
                } finally {
                  // Always ensure we stop loading
                  if (isMounted) {
                    setIsLoading(false);
                  }
                }
              }, 0);
            } else {
              if (isMounted) {
                setUser(null);
                setSession(null);
                setUserType(null);
                setIsLoading(false);
              }
            }
          }
        );
        
        // THEN check for existing session
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (initialSession?.user) {
          console.log("Initial session found:", initialSession.user.id);
          setSession(initialSession);
          
          try {
            // Set a timeout for initial profile fetching
            const profilePromise = fetchUserProfile(initialSession.user.id, setUser, setUserType);
            
            const timeoutPromise = new Promise<boolean>((resolve) => {
              setTimeout(() => resolve(false), 5000);
            });
            
            // Race between profile fetch and timeout
            const profileFound = await Promise.race([profilePromise, timeoutPromise]);
            
            if (!profileFound && isMounted) {
              console.warn("Initial profile fetch timed out or failed, using metadata");
              
              // Try to extract user_type from metadata as fallback
              const metadataUserType = initialSession.user.user_metadata?.user_type;
              if (metadataUserType) {
                setUserType(metadataUserType);
                
                // Try to create profile in the background
                fetchUserProfile(initialSession.user.id, setUser, setUserType)
                  .catch(err => console.error("Background profile creation failed:", err));
              }
            }
          } catch (error) {
            console.error("Error fetching initial profile:", error);
          } finally {
            // Always ensure loading state is updated
            if (isMounted) {
              setIsLoading(false);
            }
          }
        } else {
          console.log("No initial session found");
          if (isMounted) {
            setUser(null);
            setSession(null);
            setUserType(null);
            setIsLoading(false);
          }
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error: any) {
        console.error("Error initializing auth:", error);
        if (isMounted) {
          setAuthError("Erro ao inicializar autenticação");
          setUser(null);
          setSession(null);
          setUserType(null);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Create auth methods
  const login = async (email: string, password: string, userType: "admin" | "citizen") => {
    try {
      setIsLoading(true);
      console.log(`Attempting login for ${email} as ${userType}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        handleAuthError(error);
        return;
      }
      
      console.log("Login successful, session:", data.session);
      setSession(data.session);
      
      // Add safety timeout just in case the auth state listener fails
      setTimeout(() => {
        if (isLoading) {
          console.log("Safety timeout triggered - resetting loading state");
          setIsLoading(false);
          
          // Force redirection as fallback
          if (data.session) {
            const redirectPath = userType === "admin" ? "/admin/dashboard" : "/citizen/dashboard";
            console.log(`Forcing redirect to ${redirectPath} after timeout`);
            navigate(redirectPath, { replace: true });
          }
        }
      }, 3000);
    } catch (error: any) {
      handleAuthError(error);
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
        setSession(data.session);
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
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserType(null);
      navigate("/login", { replace: true });
    } catch (error: any) {
      console.error("Logout error:", error.message);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível encerrar sua sessão",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });

      if (error) throw error;
      
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error: any) {
      console.error("Reset password error:", error.message);
      toast({
        title: "Erro",
        description: error.message || "Falha ao enviar email de redefinição de senha",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso!",
      });
      
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (error: any) {
      console.error("Update password error:", error.message);
      toast({
        title: "Erro",
        description: error.message || "Falha ao atualizar senha",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (moduleId: string, action: "create" | "read" | "update" | "delete") => {
    if (!user || userType !== "admin") return false;
    
    // Check if user has explicit permission
    if ('permissions' in user) {
      // Check for wildcard permission
      const wildcardPermission = user.permissions.find(p => p.moduleId === 'all');
      if (wildcardPermission && wildcardPermission[action]) {
        return true;
      }
      
      // Check for specific module permission
      const modulePermission = user.permissions.find(p => p.moduleId === moduleId);
      if (modulePermission && modulePermission[action]) {
        return true;
      }
    }
    
    // Special case: prefeito role has all permissions
    if (user.role === 'prefeito') {
      return true;
    }
    
    return false;
  };

  // Handle authentication errors
  const handleAuthError = (error: any) => {
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

  // Show auth error if there is one
  if (authError) {
    return <AuthErrorHandler authError={authError} />;
  }

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session && !!user,
    userType,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{isLoading ? <AuthLoadingIndicator /> : children}</AuthContext.Provider>;
}
