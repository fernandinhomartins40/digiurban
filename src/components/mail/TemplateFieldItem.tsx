
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";

interface TemplateFieldItemProps {
  index: number;
  onRemove: () => void;
}

export function TemplateFieldItem({ index, onRemove }: TemplateFieldItemProps) {
  const { control, watch } = useForm();
  const fieldType = watch(`fields.${index}.field_type`);
  
  return (
    <div className="border rounded-md p-4 space-y-3 relative">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2"
        onClick={onRemove}
      >
        <Trash2 size={16} />
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          control={control}
          name={`fields.${index}.field_label`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rótulo do Campo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Nome do Solicitante" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name={`fields.${index}.field_key`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chave do Campo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: nome_solicitante" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          control={control}
          name={`fields.${index}.field_type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo do Campo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="textarea">Área de Texto</SelectItem>
                  <SelectItem value="date">Data</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="select">Seleção</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name={`fields.${index}.is_required`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-end space-x-3 space-y-0 pt-6">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Campo Obrigatório</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {fieldType === "select" && (
        <FormField
          control={control}
          name={`fields.${index}.field_options`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opções (formato JSON: {"{chave: \"valor\"}"}) </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder='{"op1": "Opção 1", "op2": "Opção 2"}'
                  value={field.value ? JSON.stringify(field.value) : ""}
                  onChange={(e) => {
                    try {
                      field.onChange(JSON.parse(e.target.value));
                    } catch (error) {
                      field.onChange(e.target.value);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
