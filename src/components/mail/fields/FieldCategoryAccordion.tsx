
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";
import { 
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TemplateField } from "@/types/mail";

interface FieldCategoryAccordionProps {
  categoryId: string;
  categoryTitle: string;
  fields: Partial<TemplateField>[];
  selectedFields: Record<string, boolean>;
  existingFieldKeys: string[];
  onCheckboxChange: (fieldKey: string) => void;
}

export function FieldCategoryAccordion({
  categoryId,
  categoryTitle,
  fields,
  selectedFields,
  existingFieldKeys,
  onCheckboxChange
}: FieldCategoryAccordionProps) {
  return (
    <AccordionItem value={categoryId}>
      <AccordionTrigger>{categoryTitle}</AccordionTrigger>
      <AccordionContent>
        {fields.map((field) => (
          <div key={field.field_key} className="flex items-center space-x-2 py-1">
            <Checkbox 
              id={`field-${field.field_key}`} 
              checked={field.field_key ? selectedFields[field.field_key] : false}
              onCheckedChange={() => field.field_key && onCheckboxChange(field.field_key)}
              disabled={field.field_key ? existingFieldKeys.includes(field.field_key) : false}
            />
            <label 
              htmlFor={`field-${field.field_key}`} 
              className={`text-sm ${field.field_key && existingFieldKeys.includes(field.field_key) ? 'text-muted-foreground' : ''}`}
            >
              {field.field_label}
              {field.field_key && existingFieldKeys.includes(field.field_key) && (
                <span className="ml-2 text-xs flex items-center text-green-600">
                  <Check className="h-3 w-3 mr-1" /> Já adicionado
                </span>
              )}
            </label>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
