
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TemplateField } from "@/types/mail";
import { getFieldsByCategory } from "@/utils/mailTemplateUtils";
import { useFieldsSelector } from "./useFieldsSelector";
import { PredefinedFieldsActionButton } from "./PredefinedFieldsActionButton";
import { PredefinedFieldsCategoryList } from "./PredefinedFieldsCategoryList";

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
    handleAddAllFields,
    updateSelectedFields
  } = useFieldsSelector(onAddFields, existingFieldKeys);
  
  // Update selected fields when existingFieldKeys changes
  React.useEffect(() => {
    updateSelectedFields(existingFieldKeys);
  }, [existingFieldKeys, updateSelectedFields]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex justify-between items-center">
          <span>Campos Predefinidos</span>
          <PredefinedFieldsActionButton 
            loading={loading}
            selectedCount={selectedCount}
            onAddFields={handleAddAllFields}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[400px] pr-4">
          <PredefinedFieldsCategoryList
            fieldsByCategory={fieldsByCategory}
            selectedFields={selectedFields}
            existingFieldKeys={existingFieldKeys}
            onCheckboxChange={handleCheckboxChange}
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
