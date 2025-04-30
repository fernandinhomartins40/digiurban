import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { getUserTypeFromRole, safeStorage } from "@/utils/authGuards";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: "admin" | "citizen" | null;
  login: (email: string, password: string, userType: "admin" | "citizen") => Promise<void>;
  register: (userData: any, userType: "admin" | "citizen") => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  hasPermission: (moduleId: string, action: "create" | "read" | "update" | "delete") => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to track auth initialization state across app restarts
const AUTH_INIT_KEY = "digiurban-auth-initialized";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<"admin" | "citizen" | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Helper function to clear auth state
  const clearAuthState = () => {
    setUser(null);
    setSession(null);
    setUserType(null);
    safeStorage.removeItem(AUTH_INIT_KEY);
  };

  // Function to safely fetch user profile
  const fetchUserProfile = async (userId: string) => {
    console.log("Fetching user profile for ID:", userId);

    try {
      // Try to get admin profile
      const { data: adminProfile, error: adminError } = await supabase
        .from("admin_profiles")
        .select("*, admin_permissions(*)")
        .eq("id", userId)
        .single();

      if (adminError && adminError.code !== 'PGRST116') {
        console.error("Error fetching admin profile:", adminError);
      }

      if (adminProfile) {
        console.log("Admin profile found:", adminProfile);
        const permissions = adminProfile.admin_permissions?.map((permission: any) => ({
          moduleId: permission.module_id,
          create: permission.create_permission,
          read: permission.read_permission,
          update: permission.update_permission,
          delete: permission.delete_permission,
        })) || [];

        setUser({
          id: adminProfile.id,
          email: adminProfile.email,
          name: adminProfile.name,
          role: adminProfile.role as UserRole,
          department: adminProfile.department,
          position: adminProfile.position,
          permissions,
          createdAt: adminProfile.created_at,
          updatedAt: adminProfile.updated_at,
        });
        setUserType("admin");
        setIsLoading(false);
        return true;
      }

      // If not admin, try to get citizen profile
      const { data: citizenProfile, error: citizenError } = await supabase
        .from("citizen_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (citizenError && citizenError.code !== 'PGRST116') {
        console.error("Error fetching citizen profile:", citizenError);
      }

      if (citizenProfile) {
        console.log("Citizen profile found:", citizenProfile);
        setUser({
          id: citizenProfile.id,
          email: citizenProfile.email,
          name: citizenProfile.name,
          cpf: citizenProfile.cpf,
          role: "citizen",
          address: {
            street: citizenProfile.street,
            number: citizenProfile.number,
            neighborhood: citizenProfile.neighborhood,
            city: citizenProfile.city,
            state: citizenProfile.state,
            zipCode: citizenProfile.zipcode,
          },
          phone: citizenProfile.phone,
          createdAt: citizenProfile.created_at,
          updatedAt: citizenProfile.updated_at,
        });
        setUserType("citizen");
        setIsLoading(false);
        return true;
      }

      // No profile found but user is authenticated in Supabase
      console.warn("User authenticated but no profile found. Will log out.", userId);
      return false;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return false;
    }
  };

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        setIsLoading(true);
        setAuthError(null);

        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log("Auth state change event:", event);
            
            if (!isMounted) return;
            
            if (currentSession?.user) {
              console.log("Session found in auth state change");
              setSession(currentSession);
              
              // Use setTimeout to avoid potential deadlocks with Supabase auth
              setTimeout(async () => {
                if (!isMounted) return;
                
                const profileFound = await fetchUserProfile(currentSession.user.id);
                
                if (!profileFound) {
                  console.log("No profile found for authenticated user, logging out");
                  // Clear auth state and force logout
                  clearAuthState();
                  supabase.auth.signOut().catch(console.error);
                  toast({
                    title: "Erro de perfil",
                    description: "Seu perfil não foi encontrado. Por favor, entre em contato com o suporte.",
                    variant: "destructive",
                  });
                  
                  if (isMounted) {
                    setIsLoading(false);
                    navigate("/login");
                  }
                }
              }, 0);
            } else {
              console.log("No session found in auth state change");
              if (isMounted) {
                clearAuthState();
                setIsLoading(false);
              }
            }
          }
        );
        
        authSubscription = subscription;

        // THEN check for existing session
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (initialSession?.user) {
          console.log("Initial session found");
          if (isMounted) setSession(initialSession);
          
          const profileFound = await fetchUserProfile(initialSession.user.id);
          
          if (!profileFound && isMounted) {
            console.log("No profile found for authenticated user, logging out");
            clearAuthState();
            await supabase.auth.signOut();
            toast({
              title: "Erro de perfil",
              description: "Seu perfil não foi encontrado. Por favor, entre em contato com o suporte.",
              variant: "destructive",
            });
            
            if (isMounted) {
              setIsLoading(false);
              navigate("/login");
            }
          }
        } else {
          console.log("No initial session found");
          if (isMounted) {
            clearAuthState();
            setIsLoading(false);
          }
        }

        if (isMounted) {
          safeStorage.setItem(AUTH_INIT_KEY, "true");
          setAuthInitialized(true);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (isMounted) {
          setAuthError("Erro ao inicializar autenticação");
          clearAuthState();
          setIsLoading(false);
        }
      }
    };

    // Only initialize if not already done (prevents duplicate initializations)
    if (safeStorage.getItem(AUTH_INIT_KEY) !== "true") {
      initializeAuth();
    } else {
      setAuthInitialized(true);
      if (!session && !user) {
        setIsLoading(false);
      }
    }

    return () => {
      isMounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [navigate]);

  const login = async (email: string, password: string, userType: "admin" | "citizen") => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Wait a short time for the auth state to update
      // This helps prevent redirect loops
      setTimeout(() => {
        if (!session && !user) {
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

  // Provide the auth context only after initialization to prevent premature access
  if (!authInitialized && isLoading && !authError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2">Iniciando autenticação...</span>
      </div>
    );
  }

  // Show auth error if there is one
  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-50 text-red-800 p-4 rounded-md max-w-md mb-4">
          <h3 className="text-lg font-medium">Erro na autenticação</h3>
          <p>{authError}</p>
        </div>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session && !!user, // Consider both session and user profile
    userType,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
