
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, ListPlus } from "lucide-react";

interface PredefinedFieldsActionButtonProps {
  loading: boolean;
  selectedCount: number;
  onAddFields: (e?: React.MouseEvent) => void;
}

export function PredefinedFieldsActionButton({
  loading,
  selectedCount,
  onAddFields
}: PredefinedFieldsActionButtonProps) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onAddFields(e);
      }}
      disabled={loading || selectedCount === 0}
      type="button"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <ListPlus className="h-4 w-4 mr-2" />
      )}
      Adicionar Selecionados ({selectedCount})
    </Button>
  );
}
