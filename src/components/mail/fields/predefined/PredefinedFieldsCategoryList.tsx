
import React from 'react';
import { Accordion } from "@/components/ui/accordion";
import { FieldCategoryAccordion } from "../FieldCategoryAccordion";
import { TemplateField } from "@/types/mail";

interface PredefinedFieldsCategoryListProps {
  fieldsByCategory: Record<string, Partial<TemplateField>[]>;
  selectedFields: Record<string, boolean>;
  existingFieldKeys: string[];
  onCheckboxChange: (fieldKey: string) => void;
}

export function PredefinedFieldsCategoryList({
  fieldsByCategory,
  selectedFields,
  existingFieldKeys,
  onCheckboxChange
}: PredefinedFieldsCategoryListProps) {
  return (
    <Accordion type="multiple" defaultValue={["destinatario", "documento", "remetente", "conteudo"]}>
      <FieldCategoryAccordion
        categoryId="destinatario"
        categoryTitle="Dados do Destinatário"
        fields={fieldsByCategory.destinatario}
        selectedFields={selectedFields}
        existingFieldKeys={existingFieldKeys}
        onCheckboxChange={onCheckboxChange}
      />
      <FieldCategoryAccordion
        categoryId="documento"
        categoryTitle="Dados do Documento"
        fields={fieldsByCategory.documento}
        selectedFields={selectedFields}
        existingFieldKeys={existingFieldKeys}
        onCheckboxChange={onCheckboxChange}
      />
      <FieldCategoryAccordion
        categoryId="remetente"
        categoryTitle="Dados do Remetente"
        fields={fieldsByCategory.remetente}
        selectedFields={selectedFields}
        existingFieldKeys={existingFieldKeys}
        onCheckboxChange={onCheckboxChange}
      />
      <FieldCategoryAccordion
        categoryId="conteudo"
        categoryTitle="Conteúdo"
        fields={fieldsByCategory.conteudo}
        selectedFields={selectedFields}
        existingFieldKeys={existingFieldKeys}
        onCheckboxChange={onCheckboxChange}
      />
    </Accordion>
  );
}
