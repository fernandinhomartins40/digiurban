
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldForm } from './fields/FieldForm';
import { FieldList } from './FieldList';
import { PredefinedFieldsSelector } from './PredefinedFieldsSelector';
import { TemplateField } from '@/types/mail';
import { FieldArrayWithId, UseFieldArrayReturn } from 'react-hook-form';
import { getPredefinedFieldsWithIds, getPredefinedFieldByKey } from '@/utils/mailTemplateUtils';
import { useToast } from '@/hooks/use-toast';

interface FieldCreationPanelProps {
  fields: FieldArrayWithId<any, "fields", "id">[] | any[];
  onAddField: (field: Partial<TemplateField>) => void;
  onUpdateField: (index: number, field: Partial<TemplateField>) => void;
  onRemoveField: (index: number) => void;
  onAddPredefinedFields: (fields: Partial<TemplateField>[]) => void;
  onFieldDragStart: (e: React.DragEvent, fieldKey: string, field?: Partial<TemplateField>) => void;
  onFieldClick: (fieldKey: string, targetField?: string) => void;
  existingFieldKeys: string[];
  selectedTargetField: 'content' | 'header' | 'footer';
  onChangeTargetField: (field: 'content' | 'header' | 'footer') => void;
  showPredefinedFields: boolean;
  togglePredefinedFields: () => void;
}

export function FieldCreationPanel({
  fields,
  onAddField,
  onUpdateField,
  onRemoveField,
  onAddPredefinedFields,
  onFieldDragStart,
  onFieldClick,
  existingFieldKeys,
  selectedTargetField,
  onChangeTargetField,
  showPredefinedFields,
  togglePredefinedFields
}: FieldCreationPanelProps) {
  const [activeTab, setActiveTab] = useState("fields");
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
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
  
  const handleEditField = (index: number) => {
    setEditingFieldIndex(index);
    setActiveTab("edit");
  };
  
  const handleSaveField = (field: Partial<TemplateField>) => {
    if (editingFieldIndex !== null) {
      onUpdateField(editingFieldIndex, field);
      setEditingFieldIndex(null);
      setActiveTab("fields");
    }
  };
  
  const handleCancelEdit = () => {
    setEditingFieldIndex(null);
    setActiveTab("fields");
  };
  
  const handleCreateField = (field: Partial<TemplateField>) => {
    onAddField(field);
    setActiveTab("fields");
  };

  const handleTogglePredefined = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    togglePredefinedFields();
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="fields">Campos</TabsTrigger>
          <TabsTrigger value="new">Novo Campo</TabsTrigger>
          <TabsTrigger value="edit" disabled={editingFieldIndex === null}>Editar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="fields" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Campos do Modelo
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <FieldList 
                fields={fields} 
                onFieldDragStart={onFieldDragStart}
                onFieldClick={onFieldClick}
                onEditField={handleEditField}
                onRemoveField={onRemoveField}
                selectedTarget={selectedTargetField}
                onChangeTarget={onChangeTargetField}
              />
            </CardContent>
            <CardFooter className="flex justify-between pt-0">
              <div className="flex gap-2">
                <Button 
                  onClick={handleTogglePredefined} 
                  variant={showPredefinedFields ? "default" : "outline"}
                  size="sm"
                  type="button"
                >
                  {showPredefinedFields ? "Ocultar Predefinidos" : "Mostrar Predefinidos"}
                </Button>
                <Button 
                  onClick={() => setActiveTab("new")} 
                  size="sm"
                  type="button"
                >
                  Adicionar Campo
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          {showPredefinedFields && (
            <PredefinedFieldsSelector 
              onAddFields={onAddPredefinedFields}
              existingFieldKeys={existingFieldKeys}
            />
          )}
        </TabsContent>
        
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Novo Campo</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldForm onSubmit={handleCreateField} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Editar Campo</CardTitle>
            </CardHeader>
            <CardContent>
              {editingFieldIndex !== null && (
                <FieldForm 
                  initialValues={fields[editingFieldIndex]}
                  onSubmit={handleSaveField}
                  onCancel={handleCancelEdit}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
