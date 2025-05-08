
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PredefinedFieldsSelector } from "../predefined";
import { FieldsTabContent, NewTabContent, EditTabContent } from "./TabPanelContent";
import { FieldExtractor } from "./FieldExtractor";
import { useFieldCreationPanel } from "./useFieldCreationPanel";
import { TemplateField } from '@/types/mail';
import { FieldArrayWithId } from 'react-hook-form';

interface FieldCreationPanelContentProps {
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

export function FieldCreationPanelContent({
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
}: FieldCreationPanelContentProps) {
  const {
    activeTab,
    setActiveTab,
    editingFieldIndex,
    handleEditField,
    handleSaveField,
    handleCancelEdit,
    handleCreateField
  } = useFieldCreationPanel({
    onAddField,
    onUpdateField,
    onRemoveField
  });

  return (
    <div className="space-y-4">
      <FieldExtractor 
        existingFieldKeys={existingFieldKeys}
        onAddPredefinedFields={onAddPredefinedFields}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="fields">Campos</TabsTrigger>
          <TabsTrigger value="new">Novo Campo</TabsTrigger>
          <TabsTrigger value="edit" disabled={editingFieldIndex === null}>Editar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="fields" className="space-y-4">
          <FieldsTabContent
            fields={fields}
            onFieldDragStart={onFieldDragStart}
            onFieldClick={(fieldKey) => onFieldClick(fieldKey, selectedTargetField)}
            onEditField={handleEditField}
            onRemoveField={onRemoveField}
            selectedTarget={selectedTargetField}
            onChangeTarget={onChangeTargetField}
            showPredefinedFields={showPredefinedFields}
            togglePredefinedFields={togglePredefinedFields}
            onAddField={() => setActiveTab("new")}
          />
          
          {showPredefinedFields && (
            <PredefinedFieldsSelector 
              onAddFields={onAddPredefinedFields}
              existingFieldKeys={existingFieldKeys}
            />
          )}
        </TabsContent>
        
        <TabsContent value="new">
          <NewTabContent onCreateField={handleCreateField} />
        </TabsContent>
        
        <TabsContent value="edit">
          <EditTabContent
            editingFieldIndex={editingFieldIndex}
            fields={fields}
            onSaveField={handleSaveField}
            onCancelEdit={handleCancelEdit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
