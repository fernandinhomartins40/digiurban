
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

// Maximum session idle time (30 minutes)
export const MAX_IDLE_TIME = 30 * 60 * 1000;

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
      
      toast({
        title: 'Sessão expirada',
        description: 'Sua sessão expirou por inatividade. Por favor, faça login novamente.',
        variant: 'default',
      });
      
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
    toast({
      title: 'Sessão expirando',
      description: 'Sua sessão irá expirar em breve. Deseja continuar conectado?',
      variant: 'warning',
      action: {
        label: 'Renovar Sessão',
        onClick: () => this.refreshSession()
      }
    });
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
      await supabase.auth.signOut();
      
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Error in force logout:', error);
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
}

// Export singleton instance
export const sessionManager = new SessionManager();
