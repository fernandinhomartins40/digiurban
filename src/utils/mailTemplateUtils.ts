
import { v4 as uuidv4 } from 'uuid';
import { TemplateField } from '@/types/mail';

/**
 * Generates a unique field ID for template fields
 * @returns A string formatted as a valid field key
 */
export const generateFieldId = (): string => {
  // Generate a short ID based on UUID to ensure uniqueness
  const shortId = uuidv4().substring(0, 8);
  return `field_${shortId}`;
};

/**
 * Validates if a string is a valid field key format
 * Field keys should be lowercase with underscores and no spaces
 * @param key The field key to validate
 * @returns Boolean indicating if the key is valid
 */
export const isValidFieldKey = (key: string): boolean => {
  const regex = /^[a-z0-9_]+$/;
  return regex.test(key);
};

/**
 * Converts any string to a valid field key format
 * @param text The text to convert
 * @returns A valid field key
 */
export const textToFieldKey = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
};

/**
 * Extracts field placeholders from a string
 * @param content The content to analyze
 * @returns Array of field keys found in the content
 */
export const extractFieldsFromContent = (content: string): string[] => {
  const regex = /{{([^}]+)}}/g;
  const fields: string[] = [];
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    fields.push(match[1]);
  }
  
  return [...new Set(fields)]; // Return unique fields only
};

/**
 * Predefined fields that can be added to templates
 */
export const predefinedFields: Partial<TemplateField>[] = [
  // Destinatário fields
  { field_key: 'destinatario_nome', field_label: 'Nome do Destinatário', field_type: 'text', is_required: true },
  { field_key: 'destinatario_cargo', field_label: 'Cargo do Destinatário', field_type: 'text', is_required: false },
  { field_key: 'destinatario_orgao', field_label: 'Órgão do Destinatário', field_type: 'text', is_required: false },
  { field_key: 'destinatario_endereco', field_label: 'Endereço do Destinatário', field_type: 'text', is_required: false },
  { field_key: 'destinatario_cidade', field_label: 'Cidade do Destinatário', field_type: 'text', is_required: false },
  { field_key: 'destinatario_uf', field_label: 'UF do Destinatário', field_type: 'text', is_required: false },
  { field_key: 'destinatario_cep', field_label: 'CEP do Destinatário', field_type: 'text', is_required: false },
  
  // Documento fields
  { field_key: 'documento_numero', field_label: 'Número do Documento', field_type: 'text', is_required: true },
  { field_key: 'documento_data', field_label: 'Data do Documento', field_type: 'date', is_required: true },
  { field_key: 'documento_assunto', field_label: 'Assunto do Documento', field_type: 'text', is_required: true },
  { field_key: 'documento_referencia', field_label: 'Referência do Documento', field_type: 'text', is_required: false },
  { field_key: 'documento_processo', field_label: 'Número do Processo', field_type: 'text', is_required: false },
  
  // Remetente fields
  { field_key: 'remetente_nome', field_label: 'Nome do Remetente', field_type: 'text', is_required: true },
  { field_key: 'remetente_cargo', field_label: 'Cargo do Remetente', field_type: 'text', is_required: false },
  { field_key: 'remetente_departamento', field_label: 'Departamento do Remetente', field_type: 'text', is_required: false },
  { field_key: 'remetente_assinatura', field_label: 'Assinatura do Remetente', field_type: 'text', is_required: false },
  
  // Conteúdo fields
  { field_key: 'conteudo_introducao', field_label: 'Introdução', field_type: 'textarea', is_required: false },
  { field_key: 'conteudo_desenvolvimento', field_label: 'Desenvolvimento', field_type: 'textarea', is_required: false },
  { field_key: 'conteudo_conclusao', field_label: 'Conclusão', field_type: 'textarea', is_required: false },
  { field_key: 'conteudo_agradecimento', field_label: 'Agradecimento', field_type: 'text', is_required: false },
  { field_key: 'conteudo_despedida', field_label: 'Despedida', field_type: 'text', is_required: false }
];

/**
 * Add IDs to predefined fields
 * @returns Array of predefined fields with IDs
 */
export const getPredefinedFieldsWithIds = (): Partial<TemplateField>[] => {
  return predefinedFields.map(field => ({
    ...field,
    id: generateFieldId(),
  }));
};

/**
 * Group fields by category based on field key prefix
 * @returns Object with fields grouped by category
 */
export const getFieldsByCategory = () => {
  const categories: Record<string, Partial<TemplateField>[]> = {
    destinatario: [],
    documento: [],
    remetente: [],
    conteudo: []
  };
  
  predefinedFields.forEach(field => {
    const key = field.field_key || '';
    
    if (key.startsWith('destinatario_')) {
      categories.destinatario.push(field);
    } else if (key.startsWith('documento_')) {
      categories.documento.push(field);
    } else if (key.startsWith('remetente_')) {
      categories.remetente.push(field);
    } else if (key.startsWith('conteudo_')) {
      categories.conteudo.push(field);
    } else {
      // Default to content for any other fields
      categories.conteudo.push(field);
    }
  });
  
  return categories;
};
