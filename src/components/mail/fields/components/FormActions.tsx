
import React from 'react';
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel?: (e: React.MouseEvent) => void;
  isEditing?: boolean;
}

export function FormActions({ onCancel, isEditing = false }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-2 pt-2">
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      )}
      <Button type="submit">{isEditing ? 'Atualizar' : 'Salvar'}</Button>
    </div>
  );
}
