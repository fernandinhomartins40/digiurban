
import { z } from "zod";
import { TemplateField } from "@/types/mail";

/**
 * Generates a form schema based on template fields
 * @param templateFields Template fields to include in the schema
 * @returns Zod schema for document form
 */
export function generateDocumentFormSchema(templateFields?: TemplateField[]) {
  // Base schema with required fields
  const baseSchema: Record<string, z.ZodTypeAny> = {
    title: z.string().min(3, "O título é obrigatório"),
    documentTypeId: z.string().min(1, "Selecione o tipo de documento"),
    toDepartment: z.string().min(3, "O departamento de destino é obrigatório"),
  };

  // If no template fields are provided, add content field
  if (!templateFields || !templateFields.length) {
    baseSchema.content = z.string().min(10, "O conteúdo é obrigatório");
    return z.object(baseSchema);
  }

  // Add dynamic fields based on template
  templateFields.forEach((field) => {
    if (field.is_required) {
      baseSchema[field.field_key] = z.string().min(1, `${field.field_label} é obrigatório`);
    } else {
      baseSchema[field.field_key] = z.string().optional();
    }
  });

  return z.object(baseSchema);
}
