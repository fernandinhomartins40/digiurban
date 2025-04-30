
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { safeStorage } from "@/utils/authGuards";
import { useAuthMethods } from "./auth/useAuthMethods";
import { fetchUserProfile } from "./authUtils";

// Helper to track auth initialization state across app restarts
const AUTH_INIT_KEY = "digiurban-auth-initialized";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<"admin" | "citizen" | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Import auth methods
  const { 
    login, 
    register, 
    logout, 
    resetPassword, 
    updatePassword, 
    hasPermission 
  } = useAuthMethods(user, setIsLoading, setUser, setSession, setUserType, navigate);

  // Helper function to clear auth state
  const clearAuthState = () => {
    setUser(null);
    setSession(null);
    setUserType(null);
    safeStorage.removeItem(AUTH_INIT_KEY);
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
          async (event, currentSession) => {
            console.log("Auth state change event:", event, "Session:", currentSession?.user?.id);
            
            if (!isMounted) return;
            
            if (event === 'SIGNED_OUT') {
              console.log("User signed out, clearing auth state");
              clearAuthState();
              setIsLoading(false);
              return;
            }
            
            if (currentSession?.user) {
              console.log("Session found in auth state change");
              setSession(currentSession);
              
              // Use setTimeout to avoid potential deadlocks with Supabase auth
              setTimeout(async () => {
                if (!isMounted) return;
                
                try {
                  const profileFound = await fetchUserProfile(currentSession.user.id, setUser, setUserType);
                  
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
                  } else {
                    // Profile found, make sure to set loading to false
                    if (isMounted) {
                      setIsLoading(false);
                    }
                  }
                } catch (error) {
                  console.error("Error fetching user profile:", error);
                  if (isMounted) {
                    setIsLoading(false);
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
          console.log("Initial session found:", initialSession.user.id);
          if (isMounted) setSession(initialSession);
          
          try {
            const profileFound = await fetchUserProfile(initialSession.user.id, setUser, setUserType);
            
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
            } else {
              // Profile found, ensure loading state is updated
              if (isMounted) {
                setIsLoading(false);
              }
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            if (isMounted) {
              setIsLoading(false);
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
      // If we have an auth init key but no session, we need to make sure loading is false
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
