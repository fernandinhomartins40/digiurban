/**
 * Utility for managing security headers that can be applied to our application
 */

/**
 * Content Security Policy (CSP) options
 */
export interface CSPOptions {
  defaultSrc?: string[];
  scriptSrc?: string[];
  styleSrc?: string[];
  imgSrc?: string[];
  connectSrc?: string[];
  fontSrc?: string[];
  objectSrc?: string[];
  mediaSrc?: string[];
  frameSrc?: string[];
  reportUri?: string;
}

/**
 * Generate Content Security Policy header value
 * @param options CSP options
 * @returns CSP header value
 */
export function generateCSP(options: CSPOptions): string {
  const directives: string[] = [];
  
  if (options.defaultSrc) {
    directives.push(`default-src ${options.defaultSrc.join(' ')}`);
  }
  
  if (options.scriptSrc) {
    directives.push(`script-src ${options.scriptSrc.join(' ')}`);
  }
  
  if (options.styleSrc) {
    directives.push(`style-src ${options.styleSrc.join(' ')}`);
  }
  
  if (options.imgSrc) {
    directives.push(`img-src ${options.imgSrc.join(' ')}`);
  }
  
  if (options.connectSrc) {
    directives.push(`connect-src ${options.connectSrc.join(' ')}`);
  }
  
  if (options.fontSrc) {
    directives.push(`font-src ${options.fontSrc.join(' ')}`);
  }
  
  if (options.objectSrc) {
    directives.push(`object-src ${options.objectSrc.join(' ')}`);
  }
  
  if (options.mediaSrc) {
    directives.push(`media-src ${options.mediaSrc.join(' ')}`);
  }
  
  if (options.frameSrc) {
    directives.push(`frame-src ${options.frameSrc.join(' ')}`);
  }
  
  if (options.reportUri) {
    directives.push(`report-uri ${options.reportUri}`);
  }
  
  return directives.join('; ');
}

/**
 * Default CSP configuration for the application
 * Updated for better security - removed unsafe-inline and unsafe-eval where possible
 */
export const DEFAULT_CSP: CSPOptions = {
  defaultSrc: ["'self'"],
  // Using nonce-based approach instead of unsafe-inline
  scriptSrc: ["'self'", "https://vvuwhkaxrwrdgydxvprr.supabase.co"],
  styleSrc: ["'self'", "https://fonts.googleapis.com"],
  imgSrc: ["'self'", "data:", "https://vvuwhkaxrwrdgydxvprr.supabase.co"],
  connectSrc: ["'self'", "https://vvuwhkaxrwrdgydxvprr.supabase.co"],
  fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
  objectSrc: ["'none'"],
  frameSrc: ["'self'"],
};

/**
 * Generate a nonce value for use with CSP
 * @returns Random nonce string
 */
export function generateNonce(): string {
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  
  return Array.from(randomBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate security headers for meta tags
 * @returns Object with security meta tags
 */
export function getSecurityMetaTags() {
  return {
    'Content-Security-Policy': generateCSP(DEFAULT_CSP),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'same-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  };
}

/**
 * Add and configure CSRF token to prevent CSRF attacks
 * @returns CSRF token that can be used in forms
 */
export function generateCSRFToken(): string {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  
  return Array.from(randomBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Helper to store CSRF token in session storage
 */
export function storeCSRFToken(token: string): void {
  try {
    sessionStorage.setItem('csrf_token', token);
  } catch (error) {
    console.error('Failed to store CSRF token:', error);
  }
}

/**
 * Helper to retrieve CSRF token from session storage
 */
export function retrieveCSRFToken(): string | null {
  try {
    return sessionStorage.getItem('csrf_token');
  } catch (error) {
    console.error('Failed to retrieve CSRF token:', error);
    return null;
  }
}

/**
 * Helper to verify CSRF token from a form submission
 */
export function verifyCSRFToken(token: string): boolean {
  const storedToken = retrieveCSRFToken();
  return storedToken !== null && storedToken === token;
}
