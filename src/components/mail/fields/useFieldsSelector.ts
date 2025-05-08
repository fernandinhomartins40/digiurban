
import React from 'react';
import { toast } from "@/hooks/use-toast";
import { TemplateField } from "@/types/mail";
import { getPredefinedFieldsWithIds, predefinedFields } from "@/utils/mailTemplateUtils";

export function useFieldsSelector(
  onAddFields: (fields: Partial<TemplateField>[]) => void,
  existingFieldKeys: string[]
) {
  const [loading, setLoading] = React.useState(false);
  const [selectedFields, setSelectedFields] = React.useState<Record<string, boolean>>({});
  
  // Initialize all fields as selected
  React.useEffect(() => {
    const initialSelectedState: Record<string, boolean> = {};
    predefinedFields.forEach(field => {
      if (field.field_key) {
        initialSelectedState[field.field_key] = !existingFieldKeys.includes(field.field_key);
      }
    });
    setSelectedFields(initialSelectedState);
  }, [existingFieldKeys]);
  
  const handleCheckboxChange = (fieldKey: string) => {
    setSelectedFields(prev => ({
      ...prev,
      [fieldKey]: !prev[fieldKey]
    }));
  };
  
  const handleAddAllFields = () => {
    setLoading(true);
    
    // Get selected fields to add
    const fieldsToAdd = getPredefinedFieldsWithIds().filter(
      field => field.field_key && selectedFields[field.field_key]
    );
    
    // Check if there are fields to add
    if (fieldsToAdd.length === 0) {
      toast({
        title: "Nenhum campo selecionado",
        description: "Por favor, selecione pelo menos um campo para adicionar.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    
    // Add fields
    setTimeout(() => {
      onAddFields(fieldsToAdd);
      toast({
        title: "Campos adicionados",
        description: `${fieldsToAdd.length} campo(s) predefinidos foram adicionados com sucesso.`
      });
      setLoading(false);
    }, 500);
  };
  
  // Count total selected fields
  const selectedCount = Object.values(selectedFields).filter(Boolean).length;
  
  return {
    loading,
    selectedFields,
    selectedCount,
    handleCheckboxChange,
    handleAddAllFields
  };
}
