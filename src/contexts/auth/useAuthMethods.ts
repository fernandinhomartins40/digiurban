
import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { User } from "@/types/auth";
import { Session } from "@supabase/supabase-js";
import { createAuthActions } from "./authActions";
import { createPasswordActions } from "./passwordActions";
import { createPermissionUtils } from "./permissionUtils";

/**
 * Hook providing authentication methods
 */
export function useAuthMethods(
  user: User | null,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setSession: React.Dispatch<React.SetStateAction<Session | null>>,
  setUserType: React.Dispatch<React.SetStateAction<"admin" | "citizen" | null>>,
  setSafetyTimeout: React.Dispatch<React.SetStateAction<NodeJS.Timeout | null>>,
  navigate: NavigateFunction
) {
  // Create auth methods from separate modules
  const authActions = createAuthActions(setIsLoading, setUser, setSession, setUserType, navigate);
  const passwordActions = createPasswordActions();
  const permissionUtils = createPermissionUtils(user);

  // Enhanced login wrapper to manage safety timeout
  const enhancedLogin = async (email: string, password: string, userType: "admin" | "citizen") => {
    // Clear any existing safety timeout
    setSafetyTimeout(null);
    
    // Call the login function which returns a new safety timeout if needed
    const newSafetyTimeout = await authActions.login(email, password, userType);
    
    // Store the new safety timeout if one was created
    if (newSafetyTimeout) {
      setSafetyTimeout(newSafetyTimeout);
    }
  };

  // Combine all methods into a single object
  return {
    login: enhancedLogin,
    register: authActions.register,
    logout: authActions.logout,
    ...passwordActions,
    ...permissionUtils,
  };
}
