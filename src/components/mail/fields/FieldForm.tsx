
import React from 'react';
import { TemplateField } from "@/types/mail";
import { useFieldForm } from './hooks/useFieldForm';
import { FieldTextInput } from './components/FieldTextInput';
import { FieldTypeSelect } from './components/FieldTypeSelect';
import { FieldOptions } from './components/FieldOptions';
import { RequiredFieldToggle } from './components/RequiredFieldToggle';
import { FormActions } from './components/FormActions';

interface FieldFormProps {
  initialValues?: Partial<TemplateField>;
  onSubmit: (field: Partial<TemplateField>) => void;
  onCancel?: () => void;
}

export function FieldForm({ initialValues, onSubmit, onCancel }: FieldFormProps) {
  const {
    field,
    optionsTextValue,
    handleChange,
    handleLabelChange,
    handleOptionsChange,
    handleSubmit,
    handleCancel,
    sanitizeFieldKey
  } = useFieldForm({ initialValues, onSubmit, onCancel });

  const isEditing = !!initialValues?.field_key;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FieldTextInput
        id="field_label"
        label="Rótulo do Campo"
        value={field.field_label || ''}
        onChange={handleLabelChange}
        placeholder="Nome do Campo"
        description="Nome amigável exibido para os usuários"
        required
      />

      <FieldTextInput
        id="field_key"
        label="Chave do Campo"
        value={field.field_key || ''}
        onChange={(e) => handleChange('field_key', sanitizeFieldKey(e.target.value))}
        placeholder="nome_campo"
        description="Identificador único usado nos templates, sem espaços"
        required
      />

      <FieldTypeSelect
        value={field.field_type || 'text'}
        onChange={(value) => handleChange('field_type', value)}
      />

      {field.field_type === 'select' && (
        <FieldOptions
          value={optionsTextValue}
          onChange={handleOptionsChange}
        />
      )}

      <RequiredFieldToggle
        checked={field.is_required || false}
        onChange={(checked) => handleChange('is_required', checked)}
      />

      <FormActions
        onCancel={onCancel ? handleCancel : undefined}
        isEditing={isEditing}
      />
    </form>
  );
}
