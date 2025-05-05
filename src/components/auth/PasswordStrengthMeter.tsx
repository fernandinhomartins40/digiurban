
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { validatePasswordStrength, getPasswordStrengthLabel, getPasswordStrengthColor, PasswordStrength } from '@/lib/security/passwordStrength';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const { strength, score, feedback } = validatePasswordStrength(password);
  
  // Don't show feedback for empty passwords
  if (!password) {
    return null;
  }
  
  // Determine color based on strength
  const colorClass = password ? getColorClass(strength) : '';
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium">Força da senha:</span>
        <span className={`text-xs font-semibold ${colorClass}`}>
          {getPasswordStrengthLabel(strength)}
        </span>
      </div>
      
      <Progress 
        value={score} 
        className={`h-1.5 ${getProgressColorClass(strength)}`} 
      />
      
      {feedback.length > 0 && (
        <ul className="text-xs text-muted-foreground space-y-1 mt-2">
          {feedback.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Helper function to get text color class
function getColorClass(strength: PasswordStrength): string {
  switch (strength) {
    case PasswordStrength.WEAK:
      return 'text-destructive';
    case PasswordStrength.MEDIUM:
      return 'text-amber-500';
    case PasswordStrength.STRONG:
      return 'text-green-500';
    case PasswordStrength.VERY_STRONG:
      return 'text-emerald-500';
    default:
      return '';
  }
}

// Helper function to get progress bar color class
function getProgressColorClass(strength: PasswordStrength): string {
  switch (strength) {
    case PasswordStrength.WEAK:
      return 'bg-destructive/20 [&>div]:bg-destructive';
    case PasswordStrength.MEDIUM:
      return 'bg-amber-200 [&>div]:bg-amber-500';
    case PasswordStrength.STRONG:
      return 'bg-green-200 [&>div]:bg-green-500';
    case PasswordStrength.VERY_STRONG:
      return 'bg-emerald-200 [&>div]:bg-emerald-500';
    default:
      return '';
  }
}
