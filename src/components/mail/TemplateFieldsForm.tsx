
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TemplateField } from "@/types/mail";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { Edit, GripVertical } from "lucide-react";
import { useState } from "react";

interface TemplateFieldsFormProps {
  fields: TemplateField[];
  form: UseFormReturn<any>;
}

export function TemplateFieldsForm({ fields, form }: TemplateFieldsFormProps) {
  const [draggedField, setDraggedField] = useState<string | null>(null);

  if (!fields.length) {
    return null;
  }

  const formatFieldValue = (value: any, type: string) => {
    if (value === null || value === undefined) return '';
    
    if (type === 'date' && typeof value === 'string') {
      try {
        return format(new Date(value), 'yyyy-MM-dd');
      } catch (e) {
        return value;
      }
    }
    
    return value;
  };

  const handleDragStart = (e: React.DragEvent, fieldId: string) => {
    setDraggedField(fieldId);
    e.dataTransfer.setData("text/plain", fieldId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetFieldId: string) => {
    e.preventDefault();
    
    if (draggedField && draggedField !== targetFieldId) {
      // In a real implementation, you would reorder the fields here
      // For now, we'll just show that the drag was successful
      console.log(`Field ${draggedField} dropped onto ${targetFieldId}`);
    }
    
    setDraggedField(null);
  };

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
            rules={{
              required: field.is_required ? `O campo ${field.field_label} é obrigatório` : false
            }}
            render={({ field: formField }) => (
              <FormItem 
                className="border rounded-md p-3 relative"
                draggable
                onDragStart={(e) => handleDragStart(e, field.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, field.id)}
              >
                <div className="absolute left-3 top-3 text-muted-foreground cursor-move">
                  <GripVertical size={16} />
                </div>
                <FormLabel className="ml-6">
                  {field.field_label}
                  {field.is_required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  {field.field_type === 'textarea' ? (
                    <Textarea 
                      placeholder={field.field_label} 
                      {...formField} 
                      value={formField.value || ''}
                    />
                  ) : field.field_type === 'date' ? (
                    <Input 
                      type="date" 
                      placeholder={field.field_label} 
                      {...formField} 
                      value={formatFieldValue(formField.value, 'date')}
                    />
                  ) : field.field_type === 'number' ? (
                    <Input 
                      type="number" 
                      placeholder={field.field_label} 
                      {...formField} 
                      value={formField.value || ''}
                    />
                  ) : field.field_type === 'select' && field.field_options ? (
                    <Select 
                      onValueChange={formField.onChange} 
                      defaultValue={formField.value}
                      value={formField.value || ''}
                    >
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
                    <Input 
                      placeholder={field.field_label} 
                      {...formField} 
                      value={formField.value || ''}
                    />
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
