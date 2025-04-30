
import * as z from "zod";

// Form validation schema
export const purchaseFormSchema = z.object({
  department: z.string().min(1, "O departamento é obrigatório"),
  justification: z.string().min(10, "A justificativa deve ter no mínimo 10 caracteres"),
  priority: z.enum(["low", "normal", "high", "urgent"] as const),
  items: z.array(z.object({
    name: z.string().min(2, "O nome do item é obrigatório"),
    quantity: z.coerce.number().positive("A quantidade deve ser maior que zero"),
    unit: z.string().min(1, "A unidade é obrigatória"),
    description: z.string().optional(),
    estimatedPrice: z.coerce.number().optional(),
  })).min(1, "É necessário adicionar pelo menos um item"),
});

// Define the type for the form values
export type PurchaseFormValues = z.infer<typeof purchaseFormSchema>;

// Default form values
export const defaultFormValues: PurchaseFormValues = {
  department: "",
  justification: "",
  priority: "normal",
  items: [{ name: "", quantity: 1, unit: "", description: "", estimatedPrice: undefined }],
};
