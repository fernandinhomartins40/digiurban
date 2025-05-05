
import React, { FormHTMLAttributes } from 'react';
import { useCSRFToken } from '@/hooks/useSecurityHeaders';
import { cn } from '@/lib/utils';

interface CSRFProtectedFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

/**
 * A form wrapper that automatically adds CSRF protection
 */
export function CSRFProtectedForm({ 
  children, 
  className, 
  ...props 
}: CSRFProtectedFormProps) {
  const { getCSRFToken } = useCSRFToken();
  
  return (
    <form className={cn("space-y-4", className)} {...props}>
      <input 
        type="hidden" 
        name="csrf_token" 
        value={getCSRFToken()} 
      />
      {children}
    </form>
  );
}
