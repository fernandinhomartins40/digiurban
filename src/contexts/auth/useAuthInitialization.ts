
import { useState, useEffect } from "react";
import { User } from "@/types/auth";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { fetchUserProfile } from "../authUtils";
import { NavigateFunction } from "react-router-dom";
import { safeStorage } from "@/utils/authGuards";

// Helper to track auth initialization state across app restarts
const AUTH_INIT_KEY = "digiurban-auth-initialized";

export function useAuthInitialization(navigate: NavigateFunction) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<"admin" | "citizen" | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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

  return {
    user,
    setUser,
    session,
    setSession,
    isLoading,
    setIsLoading,
    userType,
    setUserType,
    authInitialized,
    authError,
    clearAuthState
  };
}
