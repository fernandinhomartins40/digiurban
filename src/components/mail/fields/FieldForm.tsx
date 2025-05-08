
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TemplateField } from "@/types/mail";
import { Textarea } from '@/components/ui/textarea';

interface FieldFormProps {
  initialValues?: Partial<TemplateField>;
  onSubmit: (field: Partial<TemplateField>) => void;
  onCancel?: () => void;
}

export function FieldForm({ initialValues, onSubmit, onCancel }: FieldFormProps) {
  const [field, setField] = useState<Partial<TemplateField>>(
    initialValues || {
      field_key: '',
      field_label: '',
      field_type: 'text',
      is_required: false,
      field_options: null,
    }
  );

  // Use effect to initialize field options textarea value if editing
  useEffect(() => {
    if (initialValues?.field_options) {
      setOptionsTextValue(getOptionsValue());
    }
  }, [initialValues]);

  const [optionsTextValue, setOptionsTextValue] = useState(() => getOptionsValue());

  const handleChange = (key: string, value: any) => {
    setField((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Reset options when changing field type away from select
    if (key === 'field_type' && value !== 'select' && field.field_options) {
      setField((prev) => ({
        ...prev,
        field_options: null
      }));
      setOptionsTextValue('');
    }
  };

  const handleOptionsChange = (value: string) => {
    setOptionsTextValue(value);
    try {
      // Only attempt to parse if there's a value
      if (value.trim()) {
        // Split by new lines, and then filter out empties
        const options = value
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
          
        handleChange('field_options', options.length ? options : null);
      } else {
        handleChange('field_options', null);
      }
    } catch (error) {
      console.error('Error parsing options:', error);
      handleChange('field_options', null);
    }
  };

  function getOptionsValue() {
    if (!field.field_options) return '';
    if (Array.isArray(field.field_options)) {
      return field.field_options.join('\n');
    }
    return '';
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!field.field_key || !field.field_label) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o rótulo e a chave do campo.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(field);
  };

  const sanitizeFieldKey = (key: string) => {
    return key
      .toLowerCase()
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/[^a-z0-9_]/g, ''); // Remove special characters
  };

  // Auto-generate field key based on field label
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.value;
    handleChange('field_label', label);
    
    // Only auto-generate key if it's empty or was auto-generated before
    if (!field.field_key || field.field_key === sanitizeFieldKey(field.field_label || '')) {
      handleChange('field_key', sanitizeFieldKey(label));
    }
  };
  
  // Add toast import
  const toast = React.useCallback(({ title, description, variant }: { title: string, description: string, variant?: "default" | "destructive" }) => {
    // Check if toast is defined globally
    if (typeof window !== "undefined" && window.toast) {
      window.toast({ title, description, variant });
    } else {
      console.log(`${variant === "destructive" ? "[ERROR]" : "[INFO]"} ${title}: ${description}`);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="field_label">Rótulo do Campo*</Label>
        <Input
          id="field_label"
          value={field.field_label || ''}
          onChange={handleLabelChange}
          placeholder="Nome do Campo"
          required
        />
        <p className="text-xs text-muted-foreground">
          Nome amigável exibido para os usuários
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="field_key">Chave do Campo*</Label>
        <Input
          id="field_key"
          value={field.field_key || ''}
          onChange={(e) => handleChange('field_key', sanitizeFieldKey(e.target.value))}
          placeholder="nome_campo"
          required
        />
        <p className="text-xs text-muted-foreground">
          Identificador único usado nos templates, sem espaços
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="field_type">Tipo do Campo*</Label>
        <Select
          value={field.field_type || 'text'}
          onValueChange={(value) => handleChange('field_type', value)}
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

      {field.field_type === 'select' && (
        <div className="space-y-2">
          <Label htmlFor="field_options">Opções</Label>
          <Textarea
            id="field_options"
            value={optionsTextValue}
            onChange={(e) => handleOptionsChange(e.target.value)}
            placeholder="Digite uma opção por linha"
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Digite uma opção por linha
          </p>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="is_required"
          checked={field.is_required || false}
          onCheckedChange={(checked) => handleChange('is_required', checked)}
        />
        <Label htmlFor="is_required">Campo obrigatório</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCancel();
          }}>
            Cancelar
          </Button>
        )}
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
