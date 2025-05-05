
import { useEffect } from 'react';
import { getSecurityMetaTags, generateCSRFToken, storeCSRFToken } from '@/lib/security/securityHeaders';

/**
 * Hook to add security headers to the document
 */
export function useSecurityHeaders() {
  useEffect(() => {
    const metaTags = getSecurityMetaTags();
    
    // Remove any existing security meta tags
    document.querySelectorAll('meta[http-equiv]').forEach(tag => {
      if (Object.keys(metaTags).includes(tag.getAttribute('http-equiv') || '')) {
        tag.remove();
      }
    });
    
    // Add security meta tags
    Object.entries(metaTags).forEach(([name, content]) => {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', name);
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    });
    
    // Generate and store CSRF token for forms
    const csrfToken = generateCSRFToken();
    storeCSRFToken(csrfToken);
    
    return () => {
      // Clean up meta tags on unmount
      document.querySelectorAll('meta[http-equiv]').forEach(tag => {
        if (Object.keys(metaTags).includes(tag.getAttribute('http-equiv') || '')) {
          tag.remove();
        }
      });
    };
  }, []);
}

/**
 * Get CSRF token for form submissions
 */
export function useCSRFToken() {
  // Generate a new token if needed
  useEffect(() => {
    if (!sessionStorage.getItem('csrf_token')) {
      const token = generateCSRFToken();
      storeCSRFToken(token);
    }
  }, []);
  
  return {
    getCSRFToken: () => sessionStorage.getItem('csrf_token') || generateCSRFToken(),
    refreshCSRFToken: () => {
      const token = generateCSRFToken();
      storeCSRFToken(token);
      return token;
    }
  };
}
