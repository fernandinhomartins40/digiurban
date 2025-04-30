
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { UseFieldArrayRemove, Control } from "react-hook-form";
import { PurchaseFormValues } from "../utils/formUtils";

interface PurchaseItemFieldsProps {
  index: number;
  control: Control<PurchaseFormValues>;
  remove: UseFieldArrayRemove;
  canDelete: boolean;
}

export function PurchaseItemFields({ 
  index, 
  control, 
  remove, 
  canDelete 
}: PurchaseItemFieldsProps) {
  return (
    <div className="border rounded-lg p-3 space-y-3">
      <div className="flex justify-between items-center">
        <h5 className="font-medium">Item {index + 1}</h5>
        {canDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => remove(index)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          control={control}
          name={`items.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Item</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Papel A4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`items.${index}.description`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Branco, 75g" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`items.${index}.quantity`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`items.${index}.unit`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidade</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Caixa, Unidade, Pacote" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`items.${index}.estimatedPrice`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço estimado (opcional)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  placeholder="R$ 0.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
