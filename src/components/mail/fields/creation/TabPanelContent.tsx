
import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { FieldForm } from '../FieldForm';
import { TemplateField } from '@/types/mail';

interface EditTabContentProps {
  editingFieldIndex: number | null;
  fields: any[];
  onSaveField: (field: Partial<TemplateField>) => void;
  onCancelEdit: () => void;
}

export function EditTabContent({ 
  editingFieldIndex, 
  fields, 
  onSaveField, 
  onCancelEdit 
}: EditTabContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Editar Campo</CardTitle>
      </CardHeader>
      <CardContent>
        {editingFieldIndex !== null && (
          <FieldForm 
            initialValues={fields[editingFieldIndex]}
            onSubmit={onSaveField}
            onCancel={onCancelEdit}
          />
        )}
      </CardContent>
    </Card>
  );
}

interface NewTabContentProps {
  onCreateField: (field: Partial<TemplateField>) => void;
}

export function NewTabContent({ onCreateField }: NewTabContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Novo Campo</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldForm onSubmit={onCreateField} />
      </CardContent>
    </Card>
  );
}

interface FieldsTabContentProps {
  fields: any[];
  onFieldDragStart: (e: React.DragEvent, fieldKey: string, field?: Partial<TemplateField>) => void;
  onFieldClick: (fieldKey: string) => void;
  onEditField: (index: number) => void;
  onRemoveField: (index: number) => void;
  selectedTarget: 'content' | 'header' | 'footer';
  onChangeTarget: (field: 'content' | 'header' | 'footer') => void;
  showPredefinedFields: boolean;
  togglePredefinedFields: () => void;
  onAddField: () => void;
}

export function FieldsTabContent({
  fields,
  onFieldDragStart,
  onFieldClick,
  onEditField,
  onRemoveField,
  selectedTarget,
  onChangeTarget,
  showPredefinedFields,
  togglePredefinedFields,
  onAddField
}: FieldsTabContentProps) {
  return (
    <>
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
            onEditField={onEditField}
            onRemoveField={onRemoveField}
            selectedTarget={selectedTarget}
            onChangeTarget={onChangeTarget}
          />
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <div className="flex gap-2">
            <Button 
              onClick={togglePredefinedFields} 
              variant={showPredefinedFields ? "default" : "outline"}
              size="sm"
              type="button"
            >
              {showPredefinedFields ? "Ocultar Predefinidos" : "Mostrar Predefinidos"}
            </Button>
            <Button 
              onClick={onAddField} 
              size="sm"
              type="button"
            >
              Adicionar Campo
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}

// Missing imports, let's add them
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { FieldList } from "../../FieldList";
