
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
 * Sanitize inputs for database operations
 * @param input String that might contain dangerous content
 * @returns Sanitized string
 * 
 * NOTE: This should NOT be used as primary defense against SQL injection.
 * Always use Supabase parameterized queries instead of string concatenation.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // Remove potentially dangerous characters
  // This is a defense in depth, not a replacement for parameterized queries
  return input
    .replace(/['";\\]/g, '')
    .trim();
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

/**
 * Validate if input meets security requirements
 * @param input Input string to validate
 * @param pattern Regex pattern to validate against
 * @returns Boolean indicating if input is valid
 */
export function validatePattern(input: string, pattern: RegExp): boolean {
  if (!input) return false;
  return pattern.test(input);
}

/**
 * Validate email format
 * @param email Email to validate
 * @returns Boolean indicating if email is valid
 */
export function validateEmail(email: string): boolean {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return validatePattern(email, emailPattern);
}

/**
 * Validate CPF format
 * @param cpf CPF to validate
 * @returns Boolean indicating if CPF is valid
 */
export function validateCPF(cpf: string): boolean {
  const cpfClean = cpf.replace(/\D/g, '');
  
  if (cpfClean.length !== 11) return false;
  
  // Check for all same digits (invalid CPF)
  if (/^(\d)\1{10}$/.test(cpfClean)) return false;
  
  // Validation algorithm for CPF
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpfClean.substring(i-1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpfClean.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpfClean.substring(i-1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpfClean.substring(10, 11))) return false;
  
  return true;
}
