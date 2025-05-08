
import { useState, useEffect } from 'react';
import { TemplateField } from "@/types/mail";
import { toast } from "@/hooks/use-toast";

export interface UseFieldFormProps {
  initialValues?: Partial<TemplateField>;
  onSubmit: (field: Partial<TemplateField>) => void;
  onCancel?: () => void;
}

export function useFieldForm({ initialValues, onSubmit, onCancel }: UseFieldFormProps) {
  const [field, setField] = useState<Partial<TemplateField>>(
    initialValues || {
      field_key: '',
      field_label: '',
      field_type: 'text',
      is_required: false,
      field_options: null,
    }
  );
  
  const [optionsTextValue, setOptionsTextValue] = useState(() => getOptionsValue());
  
  // Use effect to initialize field options textarea value if editing
  useEffect(() => {
    if (initialValues?.field_options) {
      setOptionsTextValue(getOptionsValue());
    }
  }, [initialValues]);
  
  function getOptionsValue() {
    if (!field.field_options) return '';
    if (Array.isArray(field.field_options)) {
      return field.field_options.join('\n');
    }
    return '';
  }
  
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
  
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCancel) {
      onCancel();
    }
  };
  
  return {
    field,
    optionsTextValue,
    handleChange,
    handleLabelChange,
    handleOptionsChange,
    handleSubmit,
    handleCancel,
    sanitizeFieldKey
  };
}
