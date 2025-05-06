
import React from 'react';
import { DraggableField } from './DraggableField';
import { TemplateField } from '@/types/mail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FieldListProps {
  fields: TemplateField[];
  onFieldDragStart: (e: React.DragEvent, fieldKey: string) => void;
  onFieldClick?: (fieldKey: string) => void;
}

export function FieldList({ fields, onFieldDragStart, onFieldClick }: FieldListProps) {
  if (!fields.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Campos do Modelo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            Não há campos definidos. Adicione campos na aba "Campos".
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Campos do Modelo</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          Arraste os campos para o editor ou clique para inserir no cursor
        </p>
        <div className="space-y-1">
          {fields.map((field) => (
            <DraggableField
              key={field.id}
              label={field.field_label}
              fieldKey={field.field_key}
              isRequired={field.is_required}
              onDragStart={onFieldDragStart}
              onClick={onFieldClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
