
// Utility to validate password strength

/**
 * Password strength levels
 */
export enum PasswordStrength {
  WEAK = 'weak',
  MEDIUM = 'medium',
  STRONG = 'strong',
  VERY_STRONG = 'very_strong'
}

/**
 * Password strength requirements
 */
export interface PasswordRequirements {
  minLength: number;
  requiresUppercase: boolean;
  requiresLowercase: boolean;
  requiresNumber: boolean;
  requiresSpecialChar: boolean;
}

/**
 * Default password requirements
 */
export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requiresUppercase: true,
  requiresLowercase: true,
  requiresNumber: true,
  requiresSpecialChar: true
};

/**
 * Password strength validation result
 */
export interface PasswordValidationResult {
  isValid: boolean;
  strength: PasswordStrength;
  feedback: string[];
  score: number; // 0-100
}

/**
 * Validate password strength
 * @param password Password to validate
 * @param requirements Custom requirements (optional)
 * @returns Validation result with feedback
 */
export function validatePasswordStrength(
  password: string,
  requirements: PasswordRequirements = DEFAULT_PASSWORD_REQUIREMENTS
): PasswordValidationResult {
  const feedback: string[] = [];
  let score = 0;
  
  // Length check
  if (password.length < requirements.minLength) {
    feedback.push(`A senha deve ter pelo menos ${requirements.minLength} caracteres`);
  } else {
    score += 25;
  }
  
  // Uppercase check
  if (requirements.requiresUppercase && !/[A-Z]/.test(password)) {
    feedback.push('A senha deve conter pelo menos uma letra maiúscula');
  } else if (requirements.requiresUppercase) {
    score += 25;
  }
  
  // Lowercase check
  if (requirements.requiresLowercase && !/[a-z]/.test(password)) {
    feedback.push('A senha deve conter pelo menos uma letra minúscula');
  } else if (requirements.requiresLowercase) {
    score += 25;
  }
  
  // Number check
  if (requirements.requiresNumber && !/\d/.test(password)) {
    feedback.push('A senha deve conter pelo menos um número');
  } else if (requirements.requiresNumber) {
    score += 25;
  }
  
  // Special character check
  if (requirements.requiresSpecialChar && !/[\W_]/.test(password)) {
    feedback.push('A senha deve conter pelo menos um caractere especial');
  } else if (requirements.requiresSpecialChar) {
    score += 25;
  }
  
  // Bonus points for length beyond minimum
  if (password.length >= requirements.minLength + 4) {
    score = Math.min(100, score + 10);
  }
  
  // Determine strength
  let strength: PasswordStrength;
  if (score < 50) {
    strength = PasswordStrength.WEAK;
  } else if (score < 75) {
    strength = PasswordStrength.MEDIUM;
  } else if (score < 100) {
    strength = PasswordStrength.STRONG;
  } else {
    strength = PasswordStrength.VERY_STRONG;
  }
  
  // Final result
  return {
    isValid: feedback.length === 0,
    strength,
    feedback,
    score
  };
}

/**
 * Get readable strength label in Portuguese
 */
export function getPasswordStrengthLabel(strength: PasswordStrength): string {
  switch (strength) {
    case PasswordStrength.WEAK:
      return 'Fraca';
    case PasswordStrength.MEDIUM:
      return 'Média';
    case PasswordStrength.STRONG:
      return 'Forte';
    case PasswordStrength.VERY_STRONG:
      return 'Muito Forte';
  }
}

/**
 * Get color for password strength
 */
export function getPasswordStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case PasswordStrength.WEAK:
      return 'destructive';
    case PasswordStrength.MEDIUM:
      return 'amber';
    case PasswordStrength.STRONG:
      return 'green';
    case PasswordStrength.VERY_STRONG:
      return 'emerald';
  }
}
