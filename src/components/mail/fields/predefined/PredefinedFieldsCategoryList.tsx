
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { TemplateField } from "@/types/mail";

interface CategoryFields {
  [category: string]: Partial<TemplateField>[];
}

interface PredefinedFieldsCategoryListProps {
  fieldsByCategory: CategoryFields;
  selectedFields: Record<string, boolean>;
  existingFieldKeys: string[];
  onCheckboxChange: (fieldKey: string, checked: boolean) => void;
}

export function PredefinedFieldsCategoryList({
  fieldsByCategory,
  selectedFields,
  existingFieldKeys,
  onCheckboxChange
}: PredefinedFieldsCategoryListProps) {
  return (
    <Accordion type="multiple" className="w-full">
      {Object.entries(fieldsByCategory).map(([category, fields]) => (
        <AccordionItem value={category} key={category}>
          <AccordionTrigger className="text-sm font-medium">
            {category} ({fields.length})
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {fields.map((field) => {
                const fieldKey = field.field_key || '';
                const isExisting = existingFieldKeys.includes(fieldKey);
                
                return (
                  <div key={fieldKey} className="flex items-center space-x-2">
                    <Checkbox 
                      id={fieldKey}
                      checked={selectedFields[fieldKey] || false}
                      onCheckedChange={(checked) => {
                        onCheckboxChange(fieldKey, checked === true);
                      }}
                      disabled={isExisting}
                    />
                    <label 
                      htmlFor={fieldKey}
                      className={`text-sm ${isExisting ? 'text-gray-400 line-through' : ''}`}
                    >
                      {field.field_label}
                      {isExisting && <span className="ml-2 text-xs">(já existente)</span>}
                    </label>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
