
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ListPlus, Check } from "lucide-react";
import { getFieldsByCategory, predefinedFields, getPredefinedFieldsWithIds } from "@/utils/mailTemplateUtils";
import { TemplateField } from "@/types/mail";
import { toast } from "@/hooks/use-toast";

interface PredefinedFieldsSelectorProps {
  onAddFields: (fields: Partial<TemplateField>[]) => void;
  existingFieldKeys: string[];
}

export function PredefinedFieldsSelector({ 
  onAddFields, 
  existingFieldKeys 
}: PredefinedFieldsSelectorProps) {
  const [loading, setLoading] = React.useState(false);
  const [selectedFields, setSelectedFields] = React.useState<Record<string, boolean>>({});
  const fieldsByCategory = getFieldsByCategory();
  
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
          <AccordionItem value="destinatario">
            <AccordionTrigger>Dados do Destinatário</AccordionTrigger>
            <AccordionContent>
              {fieldsByCategory.destinatario.map((field) => (
                <div key={field.field_key} className="flex items-center space-x-2 py-1">
                  <Checkbox 
                    id={`field-${field.field_key}`} 
                    checked={field.field_key ? selectedFields[field.field_key] : false}
                    onCheckedChange={() => field.field_key && handleCheckboxChange(field.field_key)}
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
          
          <AccordionItem value="documento">
            <AccordionTrigger>Dados do Documento</AccordionTrigger>
            <AccordionContent>
              {fieldsByCategory.documento.map((field) => (
                <div key={field.field_key} className="flex items-center space-x-2 py-1">
                  <Checkbox 
                    id={`field-${field.field_key}`} 
                    checked={field.field_key ? selectedFields[field.field_key] : false}
                    onCheckedChange={() => field.field_key && handleCheckboxChange(field.field_key)}
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
          
          <AccordionItem value="remetente">
            <AccordionTrigger>Dados do Remetente</AccordionTrigger>
            <AccordionContent>
              {fieldsByCategory.remetente.map((field) => (
                <div key={field.field_key} className="flex items-center space-x-2 py-1">
                  <Checkbox 
                    id={`field-${field.field_key}`} 
                    checked={field.field_key ? selectedFields[field.field_key] : false}
                    onCheckedChange={() => field.field_key && handleCheckboxChange(field.field_key)}
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
          
          <AccordionItem value="conteudo">
            <AccordionTrigger>Conteúdo</AccordionTrigger>
            <AccordionContent>
              {fieldsByCategory.conteudo.map((field) => (
                <div key={field.field_key} className="flex items-center space-x-2 py-1">
                  <Checkbox 
                    id={`field-${field.field_key}`} 
                    checked={field.field_key ? selectedFields[field.field_key] : false}
                    onCheckedChange={() => field.field_key && handleCheckboxChange(field.field_key)}
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
        </Accordion>
      </CardContent>
    </Card>
  );
}
