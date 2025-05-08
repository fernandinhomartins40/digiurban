
import React, { useEffect } from 'react';
import { TemplateField } from '@/types/mail';
import { useToast } from '@/hooks/use-toast';
import { getPredefinedFieldByKey } from '@/utils/mailTemplateUtils';

interface FieldExtractorProps {
  existingFieldKeys: string[];
  onAddPredefinedFields: (fields: Partial<TemplateField>[]) => void;
}

export function FieldExtractor({ existingFieldKeys, onAddPredefinedFields }: FieldExtractorProps) {
  const { toast } = useToast();
  
  // Handle field extraction events from template content
  useEffect(() => {
    const handleExtractFields = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (!customEvent.detail) return;
      
      const { fieldKeys, fields: templateFields, source } = customEvent.detail;
      
      if (source === 'editor' && fieldKeys && fieldKeys.length > 0) {
        // Get predefined fields that match the extracted keys
        const fieldsToAdd = fieldKeys
          .map(key => getPredefinedFieldByKey(key))
          .filter(field => field && !existingFieldKeys.includes(field.field_key!))
          .map(field => ({...field}));
        
        if (fieldsToAdd.length > 0) {
          onAddPredefinedFields(fieldsToAdd);
          toast({
            title: "Campos detectados",
            description: `${fieldsToAdd.length} campos foram detectados e adicionados.`
          });
        } else {
          toast({
            title: "Sem novos campos",
            description: "Nenhum novo campo foi detectado no conteúdo."
          });
        }
      }
      
      if (source === 'template' && templateFields && templateFields.length > 0) {
        // Add template fields directly
        const fieldsToAdd = templateFields
          .filter(field => field && field.field_key && !existingFieldKeys.includes(field.field_key))
          .map(field => ({...field}));
        
        if (fieldsToAdd.length > 0) {
          onAddPredefinedFields(fieldsToAdd);
          toast({
            title: "Campos do modelo",
            description: `${fieldsToAdd.length} campos foram adicionados do modelo.`
          });
        }
      }
    };
    
    document.addEventListener('extract-fields', handleExtractFields);
    
    return () => {
      document.removeEventListener('extract-fields', handleExtractFields);
    };
  }, [existingFieldKeys, onAddPredefinedFields, toast]);

  // This is a utility component that doesn't render anything
  return null;
}
