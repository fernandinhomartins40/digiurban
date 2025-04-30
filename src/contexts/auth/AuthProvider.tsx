
import React, { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthMethods } from "./useAuthMethods";
import { useAuthInitialization } from "./useAuthInitialization";
import { AuthErrorHandler, AuthLoadingIndicator } from "./AuthErrorHandler";
import { AuthContextType } from "./types";

// Create Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const {
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
    setSafetyTimeout
  } = useAuthInitialization(navigate);

  // Import auth methods with enhanced timeout handling
  const { 
    login, 
    register, 
    logout, 
    resetPassword, 
    updatePassword, 
    hasPermission 
  } = useAuthMethods(
    user, 
    setIsLoading, 
    setUser, 
    setSession, 
    setUserType, 
    setSafetyTimeout,
    navigate
  );

  // Provide the auth context only after initialization to prevent premature access
  if (!authInitialized && isLoading && !authError) {
    return <AuthLoadingIndicator />;
  }

  // Show auth error if there is one
  if (authError) {
    return <AuthErrorHandler authError={authError} />;
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
