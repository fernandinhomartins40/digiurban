
import { useAuth } from '@/contexts/auth/useAuth';
import { AuditLogger, AuditOperationType } from '@/lib/security/auditLogger';
import { useCallback, useEffect } from 'react';

/**
 * Hook for audit logging capabilities
 */
export function useAuditLogger() {
  const { user } = useAuth();
  
  // Try to sync pending logs when user is authenticated
  useEffect(() => {
    if (user) {
      AuditLogger.syncPendingLogs().then(count => {
        if (count > 0) {
          console.log(`Synced ${count} pending audit logs`);
        }
      });
    }
  }, [user]);
  
  // Log function that automatically includes user ID
  const logAuditEvent = useCallback(
    (
      operationType: AuditOperationType,
      details?: any,
      targetId?: string
    ) => {
      if (!user) {
        console.warn('Cannot log audit event: No authenticated user');
        return Promise.resolve(false);
      }
      
      return AuditLogger.log({
        operationType,
        userId: user.id,
        targetId,
        details
      });
    },
    [user]
  );
  
  // Specialized logging functions for common operations
  return {
    logAuditEvent,
    
    // Authentication events
    logLogin: (details?: any) => 
      logAuditEvent(AuditOperationType.AUTH_LOGIN, details),
    
    logLogout: (details?: any) => 
      logAuditEvent(AuditOperationType.AUTH_LOGOUT, details),
    
    logPasswordReset: (details?: any) => 
      logAuditEvent(AuditOperationType.AUTH_RESET_PASSWORD, details),
    
    // User management events
    logUserCreation: (targetId: string, details?: any) => 
      logAuditEvent(AuditOperationType.USER_CREATE, details, targetId),
    
    logUserUpdate: (targetId: string, details?: any) => 
      logAuditEvent(AuditOperationType.USER_UPDATE, details, targetId),
    
    logUserDeletion: (targetId: string, details?: any) => 
      logAuditEvent(AuditOperationType.USER_DELETE, details, targetId),
    
    // Permission events
    logPermissionChange: (targetId: string, details?: any) => 
      logAuditEvent(AuditOperationType.PERMISSION_CHANGE, details, targetId),
    
    // Data operations
    logDataCreation: (entityType: string, entityId: string, details?: any) => 
      logAuditEvent(AuditOperationType.DATA_CREATE, {
        entityType,
        entityId,
        ...details
      }),
    
    logDataUpdate: (entityType: string, entityId: string, details?: any) => 
      logAuditEvent(AuditOperationType.DATA_UPDATE, {
        entityType,
        entityId,
        ...details
      }),
    
    logDataDeletion: (entityType: string, entityId: string, details?: any) => 
      logAuditEvent(AuditOperationType.DATA_DELETE, {
        entityType,
        entityId,
        ...details
      }),
    
    // Error logging
    logSystemError: (error: Error, context?: string) => 
      logAuditEvent(AuditOperationType.SYSTEM_ERROR, {
        errorMessage: error.message,
        stack: error.stack,
        context
      })
  };
}
