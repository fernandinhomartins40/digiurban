
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
  navigate: NavigateFunction
) {
  // Create auth methods from separate modules
  const authActions = createAuthActions(setIsLoading, setUser, setSession, setUserType, navigate);
  const passwordActions = createPasswordActions();
  const permissionUtils = createPermissionUtils(user);

  // Combine all methods into a single object
  return {
    ...authActions,
    ...passwordActions,
    ...permissionUtils,
  };
}
