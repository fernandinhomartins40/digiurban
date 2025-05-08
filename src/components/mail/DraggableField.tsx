
import React from 'react';
import { GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TemplateField } from '@/types/mail';

interface DraggableFieldProps {
  label: string;
  fieldKey: string;
  isRequired?: boolean;
  field?: Partial<TemplateField>;
  onDragStart: (e: React.DragEvent, fieldKey: string, field?: Partial<TemplateField>) => void;
  onClick?: (fieldKey: string) => void;
}

export function DraggableField({ 
  label, 
  fieldKey, 
  isRequired = false, 
  field,
  onDragStart,
  onClick
}: DraggableFieldProps) {
  const handleDragStart = (e: React.DragEvent) => {
    // Set plain text format for basic compatibility
    e.dataTransfer.setData('text/plain', `{{${fieldKey}}}`);
    
    // Set structured data for enhanced handling
    if (field) {
      e.dataTransfer.setData('field/json', JSON.stringify(field));
    }
    
    // Call parent handler
    onDragStart(e, fieldKey, field);
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onClick={() => onClick?.(fieldKey)}
      className={cn(
        "flex items-center gap-2 border rounded-md p-2 bg-background cursor-move mb-1",
        "hover:bg-accent hover:border-accent-foreground/20 transition-colors"
      )}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground" />
      <span className="flex-1 text-sm truncate">{label}</span>
      {isRequired && (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
          Obrigatório
        </Badge>
      )}
    </div>
  );
}
