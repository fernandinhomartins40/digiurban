
import React, { createContext, useContext } from "react";
// Remove the imported AuthContext since we're creating it here
// Change the import to use the exported types
import { AuthContextType } from "@/contexts/auth/types";
import { User } from "@/types/auth";

// Create our own AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Import and use the actual authentication provider implementation
  const { useAuth: useSupabaseAuth } = require("@/contexts/auth/AuthProvider");
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
