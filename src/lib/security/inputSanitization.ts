
/**
 * Utility functions for sanitizing user inputs to prevent XSS and other injection attacks
 */

/**
 * Sanitize HTML string by escaping special characters
 * @param input String that might contain HTML
 * @returns Sanitized string with HTML entities escaped
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitize inputs for database operations by removing SQL injection patterns
 * @param input String that might contain SQL injection attempts
 * @returns Sanitized string
 */
export function sanitizeSqlInput(input: string): string {
  if (!input) return '';
  
  // Remove common SQL injection patterns
  return input
    .replace(/(\b)(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)(\b)/gi, '')
    .replace(/['";/\\]/g, '');
}

/**
 * Safely sanitize form input while preserving valid input
 * @param input Form input string
 * @returns Sanitized string suitable for forms
 */
export function sanitizeFormInput(input: string): string {
  if (!input) return '';
  
  // First trim whitespace
  let result = input.trim();
  
  // Then remove any potentially dangerous script tags
  result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Sanitize any remaining HTML-like content
  result = sanitizeHtml(result);
  
  return result;
}

/**
 * Mask sensitive data like CPF for display
 * @param cpf The CPF to mask
 * @returns Masked CPF
 */
export function maskCpf(cpf: string): string {
  if (!cpf) return '';
  
  // Normalize by removing anything non-digit
  const normalizedCpf = cpf.replace(/\D/g, '');
  
  // Check if it's a valid CPF format (11 digits)
  if (normalizedCpf.length !== 11) {
    return cpf; // Return original if not valid
  }
  
  // Mask the middle digits
  return `${normalizedCpf.substring(0, 3)}.***.${normalizedCpf.substring(6, 9)}-**`;
}

/**
 * Sanitize any object of string properties 
 * @param obj Object with properties to sanitize
 * @returns New object with sanitized properties
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj } as Record<string, any>;
  
  for (const key in result) {
    if (typeof result[key] === 'string') {
      result[key] = sanitizeFormInput(result[key]);
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = sanitizeObject(result[key]);
    }
  }
  
  return result as T;
}
