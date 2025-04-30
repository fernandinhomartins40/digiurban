
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Control, UseFormReturn, useFieldArray } from "react-hook-form";
import { PurchaseFormValues } from "../utils/formUtils";
import { PurchaseItemFields } from "./PurchaseItemFields";

interface PurchaseItemsListProps {
  form: UseFormReturn<PurchaseFormValues>;
  control: Control<PurchaseFormValues>;
}

export function PurchaseItemsList({ form, control }: PurchaseItemsListProps) {
  const { fields, append, remove } = useFieldArray({
    name: "items",
    control
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Itens Solicitados</h4>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => append({ name: "", quantity: 1, unit: "", description: "", estimatedPrice: undefined })}
        >
          <Plus className="h-4 w-4 mr-1" /> Adicionar Item
        </Button>
      </div>

      {fields.map((field, index) => (
        <PurchaseItemFields
          key={field.id}
          index={index}
          control={control}
          remove={remove}
          canDelete={index > 0}
        />
      ))}

      {form.formState.errors.items?.message && (
        <p className="text-sm font-medium text-destructive">
          {form.formState.errors.items.message}
        </p>
      )}
    </div>
  );
}
