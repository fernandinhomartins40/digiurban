
import React from 'react';
import { TemplateField } from '@/types/mail';
import { FieldArrayWithId } from 'react-hook-form';
import { FieldCreationPanelContent } from './fields/creation/FieldCreationPanelContent';

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

export function FieldCreationPanel(props: FieldCreationPanelProps) {
  return <FieldCreationPanelContent {...props} />;
}
