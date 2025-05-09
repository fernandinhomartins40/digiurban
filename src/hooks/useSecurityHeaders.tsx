
import { useEffect } from 'react';
import { getSecurityMetaTags, generateCSRFToken, storeCSRFToken, applyCSPToScript } from '@/lib/security/securityHeaders';

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
    
    // Apply nonce to all script elements
    document.querySelectorAll('script').forEach(script => {
      if (!script.getAttribute('nonce')) {
        applyCSPToScript(script);
      }
    });
    
    // Monitor for dynamically added scripts
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeName === 'SCRIPT') {
              const scriptElement = node as HTMLScriptElement;
              if (!scriptElement.getAttribute('nonce')) {
                applyCSPToScript(scriptElement);
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    
    return () => {
      // Clean up meta tags on unmount
      document.querySelectorAll('meta[http-equiv]').forEach(tag => {
        if (Object.keys(metaTags).includes(tag.getAttribute('http-equiv') || '')) {
          tag.remove();
        }
      });
      
      // Stop observing
      observer.disconnect();
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

/**
 * Hook to create security-enhanced form submission
 */
export function useSecureForm<TData = any, TResult = any>(
  submitFn: (data: TData) => Promise<TResult>
) {
  const { getCSRFToken, refreshCSRFToken } = useCSRFToken();
  
  const secureSubmit = async (data: TData): Promise<TResult> => {
    // Add CSRF token to form data
    const csrfToken = getCSRFToken();
    const secureData = {
      ...data as any,
      _csrf: csrfToken
    };
    
    // Submit form
    const result = await submitFn(secureData as TData);
    
    // Refresh CSRF token after submission for added security
    refreshCSRFToken();
    
    return result;
  };
  
  return { secureSubmit };
}
