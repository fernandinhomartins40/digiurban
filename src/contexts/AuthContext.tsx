
import React, { createContext, useContext } from "react";
// Change the import to use our new exported useAuth
import { AuthContext as SupabaseAuthContext } from "@/contexts/auth/AuthProvider";
import { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: "admin" | "citizen" | null;
  login: (email: string, password: string, userType: "admin" | "citizen") => Promise<void>;
  register: (userData: any, userType: "admin" | "citizen") => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  hasPermission: (moduleId: string, action: "create" | "read" | "update" | "delete") => boolean;
  // Add session property that was missing
  session: any; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authContext = useContext(SupabaseAuthContext);
  
  if (!authContext) {
    throw new Error("AuthProvider must be used within a Supabase AuthProvider");
  }
  
  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  // Add a more permissive hasPermission function for development
  const enhancedContext = {
    ...context,
    hasPermission: (moduleId: string, action: "create" | "read" | "update" | "delete") => {
      // During development, allow access to all modules
      // In production, this should be replaced with proper permission checks
      if (process.env.NODE_ENV === 'development') {
        return true;
      }
      
      // Use the original hasPermission function in production
      return context.hasPermission(moduleId, action);
    }
  };

  return enhancedContext;
}
