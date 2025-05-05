
import { z } from 'zod';
import { validatePasswordStrength } from '@/lib/security/passwordStrength';

/**
 * Username validation schema
 */
export const usernameSchema = z
  .string()
  .min(3, { message: 'O nome de usuário deve ter pelo menos 3 caracteres' })
  .max(50, { message: 'O nome de usuário deve ter no máximo 50 caracteres' })
  .regex(/^[a-zA-Z0-9._-]+$/, { 
    message: 'O nome de usuário deve conter apenas letras, números, ponto, traço ou underscore' 
  });

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, { message: 'Email é obrigatório' })
  .email({ message: 'Email inválido' })
  .refine(email => !email.endsWith('@example.com'), {
    message: 'Emails de domínio example.com não são permitidos'
  });

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  .refine(password => {
    const result = validatePasswordStrength(password);
    return result.score >= 50; // Require at least medium strength
  }, {
    message: 'A senha é muito fraca. Deve conter letras maiúsculas, minúsculas, números e caracteres especiais.'
  });

/**
 * Login form validation schema
 */
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'A senha é obrigatória' }),
  userType: z.enum(['admin', 'citizen'], {
    required_error: 'Tipo de usuário é obrigatório'
  })
});

/**
 * Registration form validation schema
 */
export const registerFormSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, { message: 'Confirme sua senha' }),
  userType: z.enum(['admin', 'citizen'], {
    required_error: 'Tipo de usuário é obrigatório'
  }),
  terms: z.boolean().refine(v => v === true, {
    message: 'Você deve aceitar os termos e condições'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});

/**
 * Password reset request validation schema
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema
});

/**
 * Password update validation schema
 */
export const passwordUpdateSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, { message: 'Confirme sua senha' })
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});

// Type definitions for form data
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
export type PasswordResetRequestValues = z.infer<typeof passwordResetRequestSchema>;
export type PasswordUpdateValues = z.infer<typeof passwordUpdateSchema>;
