
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FieldTextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  description?: string;
  required?: boolean;
  readOnly?: boolean;
}

export function FieldTextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  description,
  required = false,
  readOnly = false
}: FieldTextInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}{required ? '*' : ''}</Label>
      <Input
        id={id}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
      />
      {description && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
