
import { supabase } from '@/integrations/supabase/client';

/**
 * Operation types for audit logging
 */
export enum AuditOperationType {
  AUTH_LOGIN = 'auth.login',
  AUTH_LOGOUT = 'auth.logout',
  AUTH_REGISTER = 'auth.register',
  AUTH_RESET_PASSWORD = 'auth.reset_password',
  AUTH_UPDATE_PASSWORD = 'auth.update_password',
  
  USER_CREATE = 'user.create',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',
  
  PERMISSION_CHANGE = 'permission.change',
  
  DATA_CREATE = 'data.create',
  DATA_UPDATE = 'data.update',
  DATA_DELETE = 'data.delete',
  DATA_EXPORT = 'data.export',
  DATA_ACCESS = 'data.access',
  
  CONFIG_CHANGE = 'config.change',
  
  SECURITY_EVENT = 'security.event',
  SECURITY_VIOLATION = 'security.violation',
  
  SYSTEM_ERROR = 'system.error'
}

/**
 * Interface for audit log entry
 */
export interface AuditLogEntry {
  operationType: AuditOperationType;
  userId: string;
  targetId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Service for logging audit events
 */
export class AuditLogger {
  /**
   * Log an audit event
   * @param entry Audit log entry
   * @returns True if logging was successful
   */
  static async log(entry: AuditLogEntry): Promise<boolean> {
    try {
      // Get IP address if not provided
      const ipAddress = entry.ipAddress || await this.getClientIp();
      
      // Get user agent if not provided
      const userAgent = entry.userAgent || navigator.userAgent;
      
      // Prepare log data
      const logData = {
        operation_type: entry.operationType,
        performed_by: entry.userId,
        target_user_id: entry.targetId,
        details: {
          ...entry.details,
          metadata: {
            ip_address: ipAddress,
            user_agent: userAgent,
            timestamp: new Date().toISOString(),
            severity: entry.severity || 'low'
          }
        }
      };
      
      // Insert into audit log table
      const { error } = await supabase
        .from('admin_operations_log')
        .insert(logData);
      
      if (error) {
        console.error('Error logging audit event:', error);
        
        // Fallback to local storage if database insert fails
        this.logToLocalStorage(entry);
        
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Unhandled error in audit logging:', error);
      
      // Fallback to local storage
      this.logToLocalStorage(entry);
      
      return false;
    }
  }
  
  /**
   * Log a security violation (higher severity)
   * @param userId User ID who triggered the violation
   * @param details Details of the violation
   * @returns True if logging was successful
   */
  static async logSecurityViolation(userId: string, details: any): Promise<boolean> {
    return this.log({
      operationType: AuditOperationType.SECURITY_VIOLATION,
      userId,
      details,
      severity: 'high'
    });
  }
  
  /**
   * Log a security event (informational)
   * @param userId User ID associated with the event
   * @param eventType Type of security event
   * @param details Additional details
   * @returns True if logging was successful
   */
  static async logSecurityEvent(userId: string, eventType: string, details?: any): Promise<boolean> {
    return this.log({
      operationType: AuditOperationType.SECURITY_EVENT,
      userId,
      details: {
        eventType,
        ...details
      },
      severity: 'medium'
    });
  }
  
  /**
   * Fallback method to log to localStorage if database is unavailable
   */
  private static logToLocalStorage(entry: AuditLogEntry): void {
    try {
      // Get existing logs or initialize empty array
      const existingLogs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
      
      // Add new log entry with timestamp
      existingLogs.push({
        ...entry,
        timestamp: new Date().toISOString(),
        pending: true
      });
      
      // Store back to localStorage (keep only last 100 entries)
      localStorage.setItem('audit_logs', JSON.stringify(existingLogs.slice(-100)));
    } catch (error) {
      console.error('Failed to log to localStorage:', error);
    }
  }
  
  /**
   * Try to sync pending logs from localStorage to database
   */
  static async syncPendingLogs(): Promise<number> {
    try {
      // Get pending logs from localStorage
      const pendingLogs = JSON.parse(localStorage.getItem('audit_logs') || '[]')
        .filter((log: any) => log.pending === true);
      
      if (pendingLogs.length === 0) {
        return 0;
      }
      
      // Try to insert each log
      let successCount = 0;
      
      for (const log of pendingLogs) {
        const { error } = await supabase
          .from('admin_operations_log')
          .insert({
            operation_type: log.operationType,
            performed_by: log.userId,
            target_user_id: log.targetId,
            details: log.details
          });
        
        if (!error) {
          successCount++;
          
          // Mark as synced in localStorage
          log.pending = false;
          log.synced = true;
        }
      }
      
      // Update localStorage
      localStorage.setItem('audit_logs', JSON.stringify(
        pendingLogs.filter((log: any) => log.pending === true)
      ));
      
      return successCount;
    } catch (error) {
      console.error('Failed to sync pending logs:', error);
      return 0;
    }
  }
  
  /**
   * Get client IP address (limited functionality in browser)
   */
  private static async getClientIp(): Promise<string> {
    try {
      // In a real app, this would be captured server-side
      // This is a best-effort approach for the browser
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  }
  
  /**
   * Check for suspicious activities in the audit logs
   * This would typically be done on the server side, but can be used for client-side monitoring
   */
  static async checkForSuspiciousActivity(userId: string): Promise<boolean> {
    try {
      // Get recent login attempts for this user
      const { data, error } = await supabase
        .from('admin_operations_log')
        .select('*')
        .eq('performed_by', userId)
        .eq('operation_type', 'auth.login')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error checking for suspicious activity:', error);
        return false;
      }
      
      if (!data || data.length === 0) return false;
      
      // Check for multiple devices or locations in a short time
      const uniqueIps = new Set();
      const uniqueAgents = new Set();
      
      data.forEach((log: any) => {
        const metadata = log.details?.metadata;
        if (metadata) {
          if (metadata.ip_address) uniqueIps.add(metadata.ip_address);
          if (metadata.user_agent) uniqueAgents.add(metadata.user_agent);
        }
      });
      
      // If there are multiple IPs or user agents, there might be suspicious activity
      const isSuspicious = uniqueIps.size > 2 || uniqueAgents.size > 2;
      
      // If suspicious, log it
      if (isSuspicious) {
        await this.logSecurityEvent(userId, 'multiple_access_points', {
          uniqueIps: Array.from(uniqueIps),
          uniqueAgents: Array.from(uniqueAgents)
        });
      }
      
      return isSuspicious;
    } catch (error) {
      console.error('Error in suspicious activity check:', error);
      return false;
    }
  }
}
