
import React from 'react';
import { DragHandleVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DraggableFieldProps {
  label: string;
  fieldKey: string;
  isRequired?: boolean;
  onDragStart: (e: React.DragEvent, fieldKey: string) => void;
  onClick?: (fieldKey: string) => void;
}

export function DraggableField({ 
  label, 
  fieldKey, 
  isRequired = false, 
  onDragStart,
  onClick
}: DraggableFieldProps) {
  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, fieldKey)}
      onClick={() => onClick?.(fieldKey)}
      className={cn(
        "flex items-center gap-2 border rounded-md p-2 bg-background cursor-move mb-1",
        "hover:bg-accent hover:border-accent-foreground/20 transition-colors"
      )}
    >
      <DragHandleVertical className="h-4 w-4 text-muted-foreground" />
      <span className="flex-1 text-sm truncate">{label}</span>
      {isRequired && (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
          Obrigatório
        </Badge>
      )}
    </div>
  );
}
