/**
 * Utility for managing authentication sessions and security state
 */

import { safeStorage } from './securityUtils';

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
