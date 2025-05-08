
import { v4 as uuidv4 } from 'uuid';
import { TemplateField } from '@/types/mail';

// Field categories
export const FIELD_CATEGORIES = {
  destinatario: 'Dados do Destinatário',
  documento: 'Dados do Documento',
  remetente: 'Dados do Remetente',
  conteudo: 'Conteúdo',
};

// Predefined fields
export const predefinedFields: Partial<TemplateField>[] = [
  // Destinatário fields
  {
    field_key: 'destinatario_nome',
    field_label: 'Nome do Destinatário',
    field_type: 'text',
    is_required: true,
  },
  {
    field_key: 'destinatario_cargo',
    field_label: 'Cargo do Destinatário',
    field_type: 'text',
    is_required: false,
  },
  {
    field_key: 'destinatario_orgao',
    field_label: 'Órgão do Destinatário',
    field_type: 'text',
    is_required: false,
  },
  {
    field_key: 'destinatario_endereco',
    field_label: 'Endereço do Destinatário',
    field_type: 'text',
    is_required: false,
  },
  {
    field_key: 'destinatario_cidade',
    field_label: 'Cidade do Destinatário',
    field_type: 'text',
    is_required: false,
  },
  {
    field_key: 'destinatario_estado',
    field_label: 'Estado do Destinatário',
    field_type: 'text',
    is_required: false,
  },
  {
    field_key: 'destinatario_cep',
    field_label: 'CEP do Destinatário',
    field_type: 'text',
    is_required: false,
  },
  
  // Documento fields
  {
    field_key: 'numero_oficio',
    field_label: 'Número do Ofício',
    field_type: 'text',
    is_required: true,
  },
  {
    field_key: 'data_emissao',
    field_label: 'Data de Emissão',
    field_type: 'date',
    is_required: true,
  },
  {
    field_key: 'assunto',
    field_label: 'Assunto',
    field_type: 'text',
    is_required: true,
  },
  {
    field_key: 'protocolo',
    field_label: 'Protocolo',
    field_type: 'text',
    is_required: false,
  },
  {
    field_key: 'referencia',
    field_label: 'Referência',
    field_type: 'text',
    is_required: false,
  },
  {
    field_key: 'tipo_documento',
    field_label: 'Tipo do Documento',
    field_type: 'select',
    is_required: false,
    field_options: ['Ofício', 'Memorando', 'Circular', 'Informativo'],
  },
  
  // Remetente fields
  {
    field_key: 'remetente_nome',
    field_label: 'Nome do Remetente',
    field_type: 'text',
    is_required: true,
  },
  {
    field_key: 'remetente_cargo',
    field_label: 'Cargo do Remetente',
    field_type: 'text',
    is_required: false,
  },
  {
    field_key: 'remetente_departamento',
    field_label: 'Departamento do Remetente',
    field_type: 'text',
    is_required: false,
  },
  {
    field_key: 'remetente_telefone',
    field_label: 'Telefone do Remetente',
    field_type: 'text',
    is_required: false,
  },
  {
    field_key: 'remetente_email',
    field_label: 'E-mail do Remetente',
    field_type: 'email',
    is_required: false,
  },
  
  // Conteúdo fields
  {
    field_key: 'corpo_texto',
    field_label: 'Corpo do Texto',
    field_type: 'textarea',
    is_required: true,
  },
  {
    field_key: 'conteudo_introducao',
    field_label: 'Introdução',
    field_type: 'textarea',
    is_required: false,
  },
  {
    field_key: 'conteudo_desenvolvimento',
    field_label: 'Desenvolvimento',
    field_type: 'textarea',
    is_required: false,
  },
  {
    field_key: 'conteudo_conclusao',
    field_label: 'Conclusão',
    field_type: 'textarea',
    is_required: false,
  },
  {
    field_key: 'local',
    field_label: 'Local',
    field_type: 'text',
    is_required: false,
  },
  {
    field_key: 'cidade',
    field_label: 'Cidade',
    field_type: 'text',
    is_required: false,
  },
];

// Group fields by category
export function getFieldsByCategory() {
  const fieldsByCategory: Record<string, Partial<TemplateField>[]> = {
    destinatario: [],
    documento: [],
    remetente: [],
    conteudo: [],
  };
  
  predefinedFields.forEach(field => {
    if (field.field_key?.startsWith('destinatario_')) {
      fieldsByCategory.destinatario.push(field);
    } else if (field.field_key?.startsWith('remetente_')) {
      fieldsByCategory.remetente.push(field);
    } else if (field.field_key?.startsWith('conteudo_') || 
              field.field_key === 'corpo_texto' || 
              field.field_key === 'local' || 
              field.field_key === 'cidade') {
      fieldsByCategory.conteudo.push(field);
    } else {
      fieldsByCategory.documento.push(field);
    }
  });
  
  return fieldsByCategory;
}

// Generate a random ID for a field
export function generateFieldId(): string {
  return uuidv4();
}

// Find a predefined field by key
export function getPredefinedFieldByKey(key: string): Partial<TemplateField> | undefined {
  return predefinedFields.find(field => field.field_key === key);
}

// Get all predefined fields with IDs
export function getPredefinedFieldsWithIds(): Partial<TemplateField>[] {
  return predefinedFields.map(field => ({
    ...field,
  }));
}

// Extract fields from content
export function extractFieldsFromContent(content: string): string[] {
  const fields: string[] = [];
  const regex = /{{([^{}]+)}}/g;
  let match;
  
  while ((match = regex.exec(content))) {
    const fieldKey = match[1];
    if (!fields.includes(fieldKey)) {
      fields.push(fieldKey);
    }
  }
  
  return fields;
}

// Check if a field key is already in use
export function isFieldKeyInUse(fieldKey: string, existingFields: Partial<TemplateField>[]): boolean {
  return existingFields.some(field => field.field_key === fieldKey);
}

// Generate a unique field key
export function generateUniqueFieldKey(baseKey: string, existingFields: Partial<TemplateField>[]): string {
  let fieldKey = baseKey;
  let counter = 1;
  
  while (isFieldKeyInUse(fieldKey, existingFields)) {
    fieldKey = `${baseKey}_${counter}`;
    counter++;
  }
  
  return fieldKey;
}
