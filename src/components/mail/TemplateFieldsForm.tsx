
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TemplateField } from "@/types/mail";
import { UseFormReturn } from "react-hook-form";
import { Edit } from "lucide-react";

interface TemplateFieldsFormProps {
  fields: TemplateField[];
  form: UseFormReturn<any>;
}

export function TemplateFieldsForm({ fields, form }: TemplateFieldsFormProps) {
  if (!fields.length) {
    return null;
  }

  return (
    <div className="space-y-4 border rounded-md p-4">
      <div className="flex items-center gap-2 mb-2">
        <Edit size={16} />
        <h3 className="font-medium">Campos do Modelo</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <FormField
            key={field.id}
            control={form.control}
            name={field.field_key as any}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.field_label}
                  {field.is_required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  {field.field_type === 'textarea' ? (
                    <Textarea placeholder={field.field_label} {...formField} />
                  ) : field.field_type === 'select' && field.field_options ? (
                    <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                      <SelectTrigger>
                        <SelectValue placeholder={`Selecione ${field.field_label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(field.field_options).map(([key, value]) => (
                          <SelectItem key={key} value={key}>{value as string}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input placeholder={field.field_label} {...formField} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
      
      <div className="bg-muted p-3 rounded-md">
        <p className="text-sm text-muted-foreground">
          Os campos acima serão inseridos automaticamente no modelo do documento.
        </p>
      </div>
    </div>
  );
}
