/**
 * General security utilities for the application
 */

// Modern WebCrypto API-based encryption
/**
 * Encrypts data using the Web Crypto API
 * @param text Text to encrypt
 * @param password Encryption key
 * @returns Promise resolving to encrypted data as base64 string
 */
export async function encryptData(text: string, password: string): Promise<string> {
  try {
    // Convert password to key material
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    
    // Create a key using PBKDF2
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordData,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    
    // Encrypt the data
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedText = encoder.encode(text);
    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      encodedText
    );
    
    // Combine the salt, iv, and encrypted content
    const encryptedBuffer = new Uint8Array([
      ...salt,
      ...iv,
      ...new Uint8Array(encryptedContent)
    ]);
    
    // Convert to base64
    return btoa(String.fromCharCode(...encryptedBuffer));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts data using the Web Crypto API
 * @param encryptedText Encrypted text in base64
 * @param password Encryption key
 * @returns Promise resolving to decrypted string
 */
export async function decryptData(encryptedText: string, password: string): Promise<string> {
  try {
    // Convert from base64
    const encryptedData = new Uint8Array(
      atob(encryptedText)
        .split('')
        .map(c => c.charCodeAt(0))
    );
    
    // Extract salt, iv and encrypted content
    const salt = encryptedData.slice(0, 16);
    const iv = encryptedData.slice(16, 28);
    const content = encryptedData.slice(28);
    
    // Create key material from password
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordData,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    
    // Derive the key using the salt
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    
    // Decrypt the content
    const decryptedContent = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      content
    );
    
    // Convert to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedContent);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Safely access browser storage with fallbacks and encryption support
 */
export const safeStorage = {
  async setItem(key: string, value: string, useEncryption = false): Promise<void> {
    try {
      const appKey = 'DIGIURBAN_SECURITY_KEY';
      const valueToStore = useEncryption ? await encryptData(value, appKey) : value;
      localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
      
      // Try sessionStorage as fallback
      try {
        const appKey = 'DIGIURBAN_SECURITY_KEY';
        const valueToStore = useEncryption ? await encryptData(value, appKey) : value;
        sessionStorage.setItem(key, valueToStore);
      } catch (fallbackError) {
        console.error('Error setting item in sessionStorage:', fallbackError);
      }
    }
  },
  
  async getItem(key: string, useDecryption = false): Promise<string | null> {
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
        const appKey = 'DIGIURBAN_SECURITY_KEY';
        return await decryptData(value, appKey);
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
