
import { TemplateField } from "@/types/mail";

// Predefined fields commonly used in official documents (ofícios)
export const predefinedFields: Partial<TemplateField>[] = [
  {
    field_key: "destinatario_nome",
    field_label: "Nome do Destinatário",
    field_type: "text",
    is_required: true,
    order_position: 0,
  },
  {
    field_key: "destinatario_cargo",
    field_label: "Cargo do Destinatário",
    field_type: "text",
    is_required: true,
    order_position: 1,
  },
  {
    field_key: "destinatario_orgao",
    field_label: "Órgão/Instituição",
    field_type: "text",
    is_required: true,
    order_position: 2,
  },
  {
    field_key: "numero_oficio",
    field_label: "Número do Ofício",
    field_type: "text",
    is_required: true,
    order_position: 3,
  },
  {
    field_key: "assunto",
    field_label: "Assunto",
    field_type: "text",
    is_required: true,
    order_position: 4,
  },
  {
    field_key: "referencia",
    field_label: "Referência",
    field_type: "text",
    is_required: false,
    order_position: 5,
  },
  {
    field_key: "data_emissao",
    field_label: "Data de Emissão",
    field_type: "date",
    is_required: true,
    order_position: 6,
  },
  {
    field_key: "cidade",
    field_label: "Cidade",
    field_type: "text",
    is_required: false,
    order_position: 7,
  },
  {
    field_key: "remetente_nome",
    field_label: "Nome do Remetente",
    field_type: "text",
    is_required: true,
    order_position: 8,
  },
  {
    field_key: "remetente_cargo",
    field_label: "Cargo do Remetente",
    field_type: "text",
    is_required: true,
    order_position: 9,
  },
  {
    field_key: "corpo_texto",
    field_label: "Corpo do Texto",
    field_type: "textarea",
    is_required: true,
    order_position: 10,
  }
];

// Helper function to get fields grouped by category
export const getFieldsByCategory = () => {
  return {
    destinatario: predefinedFields.filter(field => 
      field.field_key?.startsWith('destinatario_')
    ),
    documento: predefinedFields.filter(field => 
      field.field_key === 'numero_oficio' || 
      field.field_key === 'assunto' || 
      field.field_key === 'referencia' ||
      field.field_key === 'data_emissao' ||
      field.field_key === 'cidade'
    ),
    remetente: predefinedFields.filter(field => 
      field.field_key?.startsWith('remetente_')
    ),
    conteudo: predefinedFields.filter(field => 
      field.field_key === 'corpo_texto'
    ),
  };
};

// Helper function to generate a unique id for each field
export const generateFieldId = (): string => {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
};

// Helper function to add IDs to predefined fields
export const getPredefinedFieldsWithIds = (): Partial<TemplateField>[] => {
  return predefinedFields.map(field => ({
    ...field,
    id: generateFieldId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
};
