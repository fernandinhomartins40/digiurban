
import React, { createContext, useContext, useEffect } from 'react';
import { useSecurityHeaders } from '@/hooks/useSecurityHeaders';
import { sessionManager } from '@/lib/security/sessionManager';
import { SessionTimeoutWarning } from '@/components/auth/SessionTimeoutWarning';

interface SecurityContextType {
  refreshSession: () => Promise<boolean>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: React.ReactNode;
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  // Add security headers to the document
  useSecurityHeaders();
  
  // Initialize session manager on mount
  useEffect(() => {
    sessionManager.init();
  }, []);
  
  // Context value
  const value: SecurityContextType = {
    refreshSession: () => sessionManager.manualRefresh()
  };
  
  return (
    <SecurityContext.Provider value={value}>
      {children}
      <SessionTimeoutWarning />
    </SecurityContext.Provider>
  );
}

export function useSecurity(): SecurityContextType {
  const context = useContext(SecurityContext);
  
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  
  return context;
}
