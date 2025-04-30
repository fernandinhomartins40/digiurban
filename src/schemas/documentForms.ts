
import { z } from "zod";
import { TemplateField } from "@/types/mail";

export const generateDocumentFormSchema = (templateFields?: TemplateField[], baseSchema?: z.ZodObject<any>) => {
  if (!templateFields?.length) {
    return baseSchema || z.object({
      title: z.string().min(3, "Título é obrigatório"),
      documentTypeId: z.string().min(1, "Tipo de documento é obrigatório"),
      toDepartment: z.string().min(1, "Departamento destino é obrigatório"),
      content: z.string().optional(),
    });
  }
  
  // Start with base schema or create a new one
  let schema = baseSchema || z.object({
    title: z.string().min(3, "Título é obrigatório"),
    documentTypeId: z.string().min(1, "Tipo de documento é obrigatório"),
    toDepartment: z.string().min(1, "Departamento destino é obrigatório"),
  });
  
  // Add additional fields from template
  const additionalFields: Record<string, any> = {};
  
  templateFields.forEach(field => {
    // Create validator based on field type and required status
    let fieldValidator;
    
    switch (field.field_type) {
      case "text":
        fieldValidator = z.string();
        break;
      case "textarea":
        fieldValidator = z.string();
        break;
      case "number":
        fieldValidator = z.string().refine(
          (val) => !isNaN(Number(val)),
          { message: "Deve ser um número válido" }
        );
        break;
      case "date":
        fieldValidator = z.string().refine(
          (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
          { message: "Data inválida. Use o formato AAAA-MM-DD" }
        );
        break;
      case "select":
        // For select, we validate that the value is one of the available options
        const options = Object.keys(field.field_options || {});
        fieldValidator = z.string().refine(
          (val) => !val || options.includes(val),
          { message: "Opção inválida" }
        );
        break;
      default:
        fieldValidator = z.string();
    }
    
    // Make field required if specified
    if (field.is_required) {
      fieldValidator = fieldValidator.min(1, `${field.field_label} é obrigatório`);
    } else {
      fieldValidator = fieldValidator.optional();
    }
    
    additionalFields[field.field_key] = fieldValidator;
  });
  
  // Extend the base schema with our additional fields
  const extendedSchema = schema.extend(additionalFields);
  
  return extendedSchema;
};
