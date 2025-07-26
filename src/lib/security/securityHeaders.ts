
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
  childSrc?: string[];
  workerSrc?: string[];
  manifestSrc?: string[];
  formAction?: string[];
  baseUri?: string[];
  reportUri?: string;
  reportTo?: string;
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
  
  if (options.childSrc) {
    directives.push(`child-src ${options.childSrc.join(' ')}`);
  }
  
  if (options.workerSrc) {
    directives.push(`worker-src ${options.workerSrc.join(' ')}`);
  }
  
  if (options.manifestSrc) {
    directives.push(`manifest-src ${options.manifestSrc.join(' ')}`);
  }
  
  if (options.formAction) {
    directives.push(`form-action ${options.formAction.join(' ')}`);
  }
  
  if (options.baseUri) {
    directives.push(`base-uri ${options.baseUri.join(' ')}`);
  }
  
  if (options.reportUri) {
    directives.push(`report-uri ${options.reportUri}`);
  }
  
  if (options.reportTo) {
    directives.push(`report-to ${options.reportTo}`);
  }
  
  return directives.join('; ');
}

/**
 * Default CSP configuration for the application
 * Updated for better security - removed unsafe-inline and unsafe-eval where possible
 */
export const DEFAULT_CSP: CSPOptions = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'", 
    "http://82.25.69.57:8186",
    "'strict-dynamic'",
    // Allow nonce-based scripts (nonce will be added dynamically)
    (typeof window !== 'undefined') ? `'nonce-${generateNonce()}'` : ''
  ],
  styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"], // Safe in modern browsers with trusted sources
  imgSrc: ["'self'", "data:", "http://82.25.69.57:8186"],

  connectSrc: ["'self'", "http://82.25.69.57:8186"],
  fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
  objectSrc: ["'none'"],
  mediaSrc: ["'self'"],
  frameSrc: ["'self'", "http://82.25.69.57:8186"],
  formAction: ["'self'"],
  baseUri: ["'self'"],
  childSrc: ["'self'", "blob:"],
  workerSrc: ["'self'", "blob:"],
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
  // Generate a nonce for the current page load
  const nonce = generateNonce();
  
  // Add nonce to CSP
  const cspWithNonce = {
    ...DEFAULT_CSP,
    scriptSrc: [...(DEFAULT_CSP.scriptSrc || []), `'nonce-${nonce}'`]
  };
  
  return {
    'Content-Security-Policy': generateCSP(cspWithNonce),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  };
}

/**
 * Apply CSP to a script element
 * @param script The script element to apply CSP to
 * @returns The script element with CSP applied
 */
export function applyCSPToScript(script: HTMLScriptElement): HTMLScriptElement {
  const nonce = generateNonce();
  script.setAttribute('nonce', nonce);
  return script;
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

/**
 * Create a security-enhanced form submission function that includes CSRF protection
 * @param formSubmitFn The original form submission function
 * @returns A security-enhanced form submission function
 */
export function createSecureFormSubmit(formSubmitFn: (data: any) => Promise<any>) {
  return async (data: any) => {
    // Get the CSRF token from session storage
    const csrfToken = retrieveCSRFToken();
    
    // If no CSRF token exists, generate and store a new one
    if (!csrfToken) {
      const newToken = generateCSRFToken();
      storeCSRFToken(newToken);
      data._csrf = newToken;
    } else {
      // Add the existing CSRF token to the form data
      data._csrf = csrfToken;
    }
    
    return formSubmitFn(data);
  };
}

