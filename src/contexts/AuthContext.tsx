
import React, { createContext, useContext } from "react";
import { AuthContextType } from "@/contexts/auth/types";
import { User } from "@/types/auth";
import { useAuth as useSupabaseAuth } from "@/contexts/auth/useAuth";

// Create our own AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Use the imported hook instead of requiring it
  const authContext = useSupabaseAuth();
  
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
