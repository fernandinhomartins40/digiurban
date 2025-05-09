/**
 * Utility for managing authentication sessions and security state
 */

import { safeStorage } from './securityUtils';
import { showSessionTimeoutWarning, showSessionExpiredNotification } from '@/components/security/SessionTimeoutWarning';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

// Maximum session idle time (30 minutes)
export const MAX_IDLE_TIME = 30 * 60 * 1000;

/**
 * Clean up all auth-related storage on logout or before login
 * This prevents authentication limbo states where users get stuck
 * between accounts or cannot fully log out
 */
export const cleanupAuthState = () => {
  try {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || 
          key.includes('sb-') || 
          key.includes('supabase') ||
          key.includes('digiurban-auth')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear session storage as well
    if (typeof sessionStorage !== 'undefined') {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || 
            key.includes('sb-') || 
            key.includes('supabase') ||
            key.includes('digiurban-auth')) {
          sessionStorage.removeItem(key);
        }
      });
    }
    
    // Clear CSRF token
    sessionStorage.removeItem('csrf_token');
    
    // Clear any auth-related cookies
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.trim().split('=');
      if (name.includes('auth') || name.includes('token') || name.includes('session')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
    
    // Clear any sensitive data stored in application-specific storage
    safeStorage.removeItem('user-data');
    safeStorage.removeItem('user-preferences');
    safeStorage.removeItem('auth-state');
    safeStorage.removeItem('address-data');
    safeStorage.removeItem('recent-searches');
  } catch (error) {
    console.error('Error cleaning up auth state:', error);
  }
};

/**
 * Verify if current session is valid
 * @returns Boolean indicating if session is valid
 */
export const verifySessionIntegrity = (): boolean => {
  try {
    // Check if we have a valid Supabase token in storage
    const hasSupabaseToken = Boolean(
      localStorage.getItem('supabase.auth.token') || 
      sessionStorage.getItem('supabase.auth.token')
    );
    
    // Check for CSRF token in session storage
    const hasCsrfToken = Boolean(sessionStorage.getItem('csrf_token'));
    
    // Other security checks can be added here
    
    // Both tokens should be present for a valid session
    return hasSupabaseToken && hasCsrfToken;
  } catch (error) {
    console.error('Error verifying session integrity:', error);
    return false;
  }
};

/**
 * Force a complete session refresh
 * This is a hard refresh that ensures a clean state
 */
export const forceSessionRefresh = (redirectUrl: string = '/login') => {
  try {
    // Clean up auth state first
    cleanupAuthState();
    
    // Force full page reload to ensure clean state
    window.location.href = redirectUrl;
  } catch (error) {
    console.error('Error forcing session refresh:', error);
    // Fallback in case of error
    window.location.reload();
  }
};

/**
 * Manages session activity and implements auto-logout for security
 */
export class SessionManager {
  private idleTimer: number | null = null;
  private lastActivity: number = Date.now();
  private isActive: boolean = true;
  
  /**
   * Initialize the session manager
   */
  public init() {
    this.setupActivityListeners();
    this.startIdleTimer();
    
    // Check session on init
    this.checkSession();
    
    // Set up interval to check session periodically
    setInterval(() => this.checkSession(), 5 * 60 * 1000); // Every 5 minutes
    
    console.log('Session manager initialized');
  }
  
  /**
   * Track user activity to prevent auto-logout while active
   */
  private setupActivityListeners() {
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const activityHandler = () => {
      this.recordActivity();
    };
    
    // Add activity listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, activityHandler, { passive: true });
    });
    
    // Visibility change detection
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.isActive = true;
        this.recordActivity();
      } else {
        this.isActive = false;
      }
    });
    
    // Cleanup on window unload
    window.addEventListener('beforeunload', () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, activityHandler);
      });
    });
  }
  
  /**
   * Record user activity and reset the idle timer
   */
  private recordActivity() {
    this.lastActivity = Date.now();
    
    // Restart the idle timer
    if (this.isActive) {
      this.restartIdleTimer();
    }
  }
  
  /**
   * Start or restart the idle timer
   */
  private startIdleTimer() {
    // Clear any existing timer
    if (this.idleTimer !== null) {
      window.clearTimeout(this.idleTimer);
    }
    
    // Set new timer
    this.idleTimer = window.setTimeout(() => {
      this.handleUserIdle();
    }, MAX_IDLE_TIME);
  }
  
  /**
   * Restart the idle timer
   */
  private restartIdleTimer() {
    this.startIdleTimer();
  }
  
  /**
   * Handle user being idle for too long
   */
  private async handleUserIdle() {
    // Check if user has been idle for too long
    const idleTime = Date.now() - this.lastActivity;
    
    if (idleTime >= MAX_IDLE_TIME) {
      console.log('User idle timeout reached, logging out');
      
      showSessionExpiredNotification();
      
      // Perform logout
      await this.forceLogout();
    } else {
      // Recalculate time remaining and restart timer
      const remainingTime = MAX_IDLE_TIME - idleTime;
      this.idleTimer = window.setTimeout(() => {
        this.handleUserIdle();
      }, remainingTime);
    }
  }
  
  /**
   * Check if the current session is valid
   */
  private async checkSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        return;
      }
      
      if (!data.session) {
        console.log('No active session found');
        return;
      }
      
      this.validateSessionExpiry(data.session);
    } catch (error) {
      console.error('Error checking session:', error);
    }
  }
  
  /**
   * Validate if the session is about to expire
   */
  private validateSessionExpiry(session: Session) {
    if (!session?.expires_at) return;
    
    // Calculate time until expiry in milliseconds
    const expiresAt = new Date(session.expires_at).getTime();
    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;
    
    // Warn user 5 minutes before expiry
    if (timeUntilExpiry > 0 && timeUntilExpiry < 5 * 60 * 1000) {
      this.warnSessionExpiry();
    }
  }
  
  /**
   * Warn user about impending session expiry
   */
  private warnSessionExpiry() {
    const handleRefresh = () => this.refreshSession();
    showSessionTimeoutWarning(handleRefresh);
  }
  
  /**
   * Refresh the current session
   */
  private async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível renovar sua sessão. Por favor, faça login novamente.',
          variant: 'destructive',
        });
        
        await this.forceLogout();
        return;
      }
      
      if (data.session) {
        toast({
          title: 'Sessão renovada',
          description: 'Sua sessão foi renovada com sucesso.',
          variant: 'default',
        });
        
        this.recordActivity();
      }
    } catch (error) {
      console.error('Error in refreshSession:', error);
    }
  }
  
  /**
   * Force logout the user
   */
  private async forceLogout() {
    try {
      // Clean up auth state first
      cleanupAuthState();
      
      // Sign out with global scope to clear server session as well
      await supabase.auth.signOut({ scope: 'global' });
      
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Error in force logout:', error);
      // Fallback: attempt redirect even if signOut fails
      window.location.href = '/login';
    }
  }
  
  /**
   * Get the time remaining before auto-logout
   */
  public getTimeRemaining(): number {
    return Math.max(0, MAX_IDLE_TIME - (Date.now() - this.lastActivity));
  }
  
  /**
   * Manually refresh the session
   */
  public async manualRefresh(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error || !data.session) {
        return false;
      }
      
      this.recordActivity();
      return true;
    } catch (error) {
      console.error('Error in manual refresh:', error);
      return false;
    }
  }
  
  /**
   * Perform secure logout
   * @returns Promise that resolves when logout is complete
   */
  public async secureLogout(): Promise<boolean> {
    try {
      // Clean up auth state first
      cleanupAuthState();
      
      // Sign out with global scope
      await supabase.auth.signOut({ scope: 'global' });
      return true;
    } catch (error) {
      console.error('Error during secure logout:', error);
      return false;
    }
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();
