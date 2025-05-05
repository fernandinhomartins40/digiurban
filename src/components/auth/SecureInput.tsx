
import React, { useState, InputHTMLAttributes, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { sanitizeFormInput } from '@/lib/security/inputSanitization';

export interface SecureInputProps extends InputHTMLAttributes<HTMLInputElement> {
  mask?: boolean;
  sanitize?: boolean;
}

const SecureInput = forwardRef<HTMLInputElement, SecureInputProps>(
  ({ className, type, sanitize = true, mask = false, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const handleTogglePassword = (e: React.MouseEvent) => {
      e.preventDefault();
      setShowPassword(!showPassword);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (sanitize) {
        // Create a new event with sanitized value
        const sanitizedEvent = {
          ...e,
          target: {
            ...e.target,
            value: sanitizeFormInput(e.target.value)
          }
        };
        
        onChange?.(sanitizedEvent as React.ChangeEvent<HTMLInputElement>);
      } else {
        onChange?.(e);
      }
    };
    
    const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;
    
    return (
      <div className="relative">
        <Input
          type={inputType}
          className={cn(
            "pr-10",
            className
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
        />
        
        {type === 'password' && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
            onClick={handleTogglePassword}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">
              {showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            </span>
          </Button>
        )}
      </div>
    );
  }
);

SecureInput.displayName = 'SecureInput';

export { SecureInput };
