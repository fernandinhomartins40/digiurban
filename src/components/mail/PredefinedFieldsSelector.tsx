
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { Loader2, ListPlus } from "lucide-react";
import { getFieldsByCategory } from "@/utils/mailTemplateUtils";
import { TemplateField } from "@/types/mail";
import { FieldCategoryAccordion } from "./fields/FieldCategoryAccordion";
import { useFieldsSelector } from "./fields/useFieldsSelector";

interface PredefinedFieldsSelectorProps {
  onAddFields: (fields: Partial<TemplateField>[]) => void;
  existingFieldKeys: string[];
}

export function PredefinedFieldsSelector({ 
  onAddFields, 
  existingFieldKeys 
}: PredefinedFieldsSelectorProps) {
  const fieldsByCategory = getFieldsByCategory();
  const {
    loading,
    selectedFields,
    selectedCount,
    handleCheckboxChange,
    handleAddAllFields
  } = useFieldsSelector(onAddFields, existingFieldKeys);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex justify-between items-center">
          <span>Campos Predefinidos</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddAllFields}
            disabled={loading || selectedCount === 0}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ListPlus className="h-4 w-4 mr-2" />
            )}
            Adicionar Selecionados ({selectedCount})
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["destinatario", "documento", "remetente", "conteudo"]}>
          <FieldCategoryAccordion
            categoryId="destinatario"
            categoryTitle="Dados do Destinatário"
            fields={fieldsByCategory.destinatario}
            selectedFields={selectedFields}
            existingFieldKeys={existingFieldKeys}
            onCheckboxChange={handleCheckboxChange}
          />
          <FieldCategoryAccordion
            categoryId="documento"
            categoryTitle="Dados do Documento"
            fields={fieldsByCategory.documento}
            selectedFields={selectedFields}
            existingFieldKeys={existingFieldKeys}
            onCheckboxChange={handleCheckboxChange}
          />
          <FieldCategoryAccordion
            categoryId="remetente"
            categoryTitle="Dados do Remetente"
            fields={fieldsByCategory.remetente}
            selectedFields={selectedFields}
            existingFieldKeys={existingFieldKeys}
            onCheckboxChange={handleCheckboxChange}
          />
          <FieldCategoryAccordion
            categoryId="conteudo"
            categoryTitle="Conteúdo"
            fields={fieldsByCategory.conteudo}
            selectedFields={selectedFields}
            existingFieldKeys={existingFieldKeys}
            onCheckboxChange={handleCheckboxChange}
          />
        </Accordion>
      </CardContent>
    </Card>
  );
}
