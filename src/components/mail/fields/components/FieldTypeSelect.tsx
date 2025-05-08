
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FieldTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function FieldTypeSelect({ value, onChange }: FieldTypeSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="field_type">Tipo do Campo*</Label>
      <Select
        value={value || 'text'}
        onValueChange={onChange}
      >
        <SelectTrigger id="field_type">
          <SelectValue placeholder="Selecione um tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text">Texto</SelectItem>
          <SelectItem value="textarea">Texto longo</SelectItem>
          <SelectItem value="number">Número</SelectItem>
          <SelectItem value="date">Data</SelectItem>
          <SelectItem value="select">Lista de opções</SelectItem>
          <SelectItem value="checkbox">Caixa de seleção</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
