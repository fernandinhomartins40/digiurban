
/**
 * General security utilities for the application
 */

/**
 * Safely access browser storage with fallbacks and encryption support
 */
export const safeStorage = {
  setItem(key: string, value: string, useEncryption = false): void {
    try {
      const valueToStore = useEncryption ? simpleEncrypt(value) : value;
      localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
      
      // Try sessionStorage as fallback
      try {
        const valueToStore = useEncryption ? simpleEncrypt(value) : value;
        sessionStorage.setItem(key, valueToStore);
      } catch (fallbackError) {
        console.error('Error setting item in sessionStorage:', fallbackError);
      }
    }
  },
  
  getItem(key: string, useDecryption = false): string | null {
    let value: string | null = null;
    
    try {
      value = localStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      
      // Try sessionStorage as fallback
      try {
        value = sessionStorage.getItem(key);
      } catch (fallbackError) {
        console.error('Error getting item from sessionStorage:', fallbackError);
      }
    }
    
    // Decrypt if needed
    if (value && useDecryption) {
      try {
        return simpleDecrypt(value);
      } catch (decryptError) {
        console.error('Error decrypting value:', decryptError);
        return null;
      }
    }
    
    return value;
  },
  
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
    }
    
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from sessionStorage:', error);
    }
  },
  
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
    
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  }
};

/**
 * Simple encryption function (for demonstration purposes)
 * Note: In a production app, use a proper encryption library
 */
function simpleEncrypt(text: string): string {
  // Simple XOR encryption with a hardcoded key
  // This is NOT secure for production use
  const key = 'DIGIURBAN_SECURITY_KEY';
  let result = '';
  
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  
  // Convert to base64 for storage
  return btoa(result);
}

/**
 * Simple decryption function (for demonstration purposes)
 * Note: In a production app, use a proper encryption library
 */
function simpleDecrypt(encryptedText: string): string {
  // Decode from base64
  const decoded = atob(encryptedText);
  const key = 'DIGIURBAN_SECURITY_KEY';
  let result = '';
  
  // XOR decrypt
  for (let i = 0; i < decoded.length; i++) {
    const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  
  return result;
}

/**
 * Clear sensitive data when user logs out
 */
export function clearSensitiveData(): void {
  // List of keys that should be cleared on logout
  const sensitiveKeys = [
    'user-data',
    'user-preferences',
    'auth-state',
    'address-data',
    'recent-searches'
  ];
  
  // Clear specific keys
  sensitiveKeys.forEach(key => {
    safeStorage.removeItem(key);
  });
  
  // Clear all auth-related cookies (if any)
  document.cookie.split(';').forEach(cookie => {
    const [name] = cookie.trim().split('=');
    if (name.includes('auth') || name.includes('token') || name.includes('session')) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });
}

/**
 * Detect browser capabilities for security features
 */
export function detectSecurityCapabilities(): Record<string, boolean> {
  return {
    localStorage: typeof localStorage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined',
    crypto: typeof crypto !== 'undefined' && !!crypto.subtle,
    secureContext: window.isSecureContext,
    cookiesEnabled: navigator.cookieEnabled,
    serviceWorker: 'serviceWorker' in navigator
  };
}
