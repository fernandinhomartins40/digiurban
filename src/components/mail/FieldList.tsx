
import { TemplateField } from "@/types/mail";
import { GripHorizontal as DragIcon } from "lucide-react";
import { DraggableField } from "@/components/mail/DraggableField";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FieldArrayWithId } from "react-hook-form";

interface FieldListProps {
  fields: (TemplateField | FieldArrayWithId<any, "fields", "id">)[];
  onFieldDragStart: (e: React.DragEvent, fieldKey: string, field?: Partial<TemplateField>) => void;
  onFieldClick: (fieldKey: string, targetField?: string) => void;
}

export function FieldList({ fields, onFieldDragStart, onFieldClick }: FieldListProps) {
  const [selectedTarget, setSelectedTarget] = useState<'content' | 'header' | 'footer'>('content');

  if (!fields.length) {
    return (
      <div className="border rounded-md p-4">
        <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
          <DragIcon className="h-4 w-4" />
          Campos Disponíveis
        </h3>
        <p className="text-xs text-muted-foreground text-center py-2">
          Nenhum campo definido
        </p>
      </div>
    );
  }

  const handleFieldClick = (fieldKey: string) => {
    onFieldClick(fieldKey, selectedTarget);
  };

  return (
    <div className="border rounded-md p-4 space-y-3">
      <div>
        <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
          <DragIcon className="h-4 w-4" />
          Campos Disponíveis
        </h3>
        
        <div className="flex gap-1 mb-3">
          <Button 
            variant={selectedTarget === 'content' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSelectedTarget('content')}
            className="text-xs h-7 px-2"
          >
            Conteúdo
          </Button>
          <Button 
            variant={selectedTarget === 'header' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSelectedTarget('header')}
            className="text-xs h-7 px-2"
          >
            Cabeçalho
          </Button>
          <Button 
            variant={selectedTarget === 'footer' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSelectedTarget('footer')}
            className="text-xs h-7 px-2"
          >
            Rodapé
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mb-2">
          Arraste os campos para o {selectedTarget === 'content' ? 'conteúdo' : selectedTarget === 'header' ? 'cabeçalho' : 'rodapé'} ou clique para inserir.
        </p>
      </div>

      <div className="space-y-1">
        {fields.map((field) => {
          // Safely get properties regardless of the field type
          const fieldKey = (field as any).field_key;
          const fieldLabel = (field as any).field_label;
          const isRequired = (field as any).is_required;
          
          if (!fieldKey) return null;
          
          return (
            <DraggableField
              key={fieldKey}
              label={fieldLabel}
              fieldKey={fieldKey}
              field={field}
              isRequired={isRequired}
              onDragStart={onFieldDragStart}
              onClick={() => handleFieldClick(fieldKey)}
            />
          );
        })}
      </div>
    </div>
  );
}
