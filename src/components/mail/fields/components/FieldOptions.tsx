
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';

interface FieldOptionsProps {
  value: string;
  onChange: (value: string) => void;
}

export function FieldOptions({ value, onChange }: FieldOptionsProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="field_options">Opções</Label>
      <Textarea
        id="field_options"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Digite uma opção por linha"
        rows={4}
      />
      <p className="text-xs text-muted-foreground">
        Digite uma opção por linha
      </p>
    </div>
  );
}
