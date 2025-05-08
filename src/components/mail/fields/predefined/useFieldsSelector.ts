
import { useEffect, useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { TemplateField } from "@/types/mail";
import { getPredefinedFieldsWithIds, predefinedFields } from "@/utils/mailTemplateUtils";

export function useFieldsSelector(
  onAddFields: (fields: Partial<TemplateField>[]) => void,
  existingFieldKeys: string[]
) {
  const [loading, setLoading] = useState(false);
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  // Initialize fields with existing fields marked as unselected
  const updateSelectedFields = useCallback((existingKeys: string[]) => {
    const initialSelectedState: Record<string, boolean> = {};
    predefinedFields.forEach(field => {
      if (field.field_key) {
        // Only select fields that are not already added
        initialSelectedState[field.field_key] = !existingKeys.includes(field.field_key);
      }
    });
    setSelectedFields(initialSelectedState);
  }, []);
  
  // Initialize all fields when component mounts or existing fields change
  useEffect(() => {
    updateSelectedFields(existingFieldKeys);
  }, [existingFieldKeys, updateSelectedFields]);
  
  const handleCheckboxChange = useCallback((fieldKey: string) => {
    setSelectedFields(prev => ({
      ...prev,
      [fieldKey]: !prev[fieldKey]
    }));
  }, []);
  
  const handleAddAllFields = useCallback((e?: React.MouseEvent) => {
    // Prevent default form submission if this is triggered by a button click
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setLoading(true);
    
    try {
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
        return;
      }
      
      // Add fields with a small delay to avoid UI freezing
      setTimeout(() => {
        onAddFields(fieldsToAdd);
        toast({
          title: "Campos adicionados",
          description: `${fieldsToAdd.length} campo(s) predefinidos foram adicionados com sucesso.`
        });
        
        // Mark added fields as unselected
        setSelectedFields(prev => {
          const newState = {...prev};
          fieldsToAdd.forEach(field => {
            if (field.field_key) {
              newState[field.field_key] = false;
            }
          });
          return newState;
        });
      }, 100);
    } catch (error) {
      toast({
        title: "Erro ao adicionar campos",
        description: "Ocorreu um erro ao adicionar os campos selecionados.",
        variant: "destructive"
      });
      console.error("Error adding fields:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedFields, onAddFields, toast]);
  
  // Count total selected fields
  const selectedCount = Object.entries(selectedFields).filter(([_, selected]) => selected).length;
  
  return {
    loading,
    selectedFields,
    selectedCount,
    handleCheckboxChange,
    handleAddAllFields,
    updateSelectedFields
  };
}
