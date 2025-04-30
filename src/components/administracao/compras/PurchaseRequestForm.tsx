import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, SendHorizonal, Plus, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PurchasePriority } from "@/types/administration";
import { useAuth } from "@/contexts/auth/useAuth";
import { createPurchaseRequest, uploadPurchaseAttachment } from "@/services/administration/purchaseService";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  department: z.string().min(1, "O departamento é obrigatório"),
  justification: z.string().min(10, "A justificativa deve ter no mínimo 10 caracteres"),
  priority: z.enum(["low", "normal", "high", "urgent"] as const),
  items: z.array(z.object({
    name: z.string().min(2, "O nome do item é obrigatório"),
    quantity: z.coerce.number().positive("A quantidade deve ser maior que zero"),
    unit: z.string().min(1, "A unidade é obrigatória"),
    description: z.string().optional(),
    estimatedPrice: z.coerce.number().optional(),
  })).min(1, "É necessário adicionar pelo menos um item"),
});

interface PurchaseRequestFormProps {
  onRequestCreated: () => void;
  departmentsList: string[];
}

export function PurchaseRequestForm({ onRequestCreated, departmentsList }: PurchaseRequestFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: "",
      justification: "",
      priority: "normal",
      items: [{ name: "", quantity: 1, unit: "", description: "", estimatedPrice: undefined }],
    },
  });

  // Use useFieldArray from react-hook-form directly
  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control
  });

  // Handle file selection
  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
    e.target.value = "";
  };

  // Remove file from list
  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Create purchase request
      const request = await createPurchaseRequest(
        user.id,
        values.department,
        values.justification,
        values.priority,
        values.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          description: item.description,
          estimatedPrice: item.estimatedPrice,
        }))
      );

      if (!request) {
        throw new Error("Erro ao criar solicitação de compra");
      }

      // Upload attachments if any
      if (files.length > 0) {
        for (const file of files) {
          await uploadPurchaseAttachment(user.id, request.id, file);
        }
      }

      toast({
        title: "Solicitação enviada",
        description: `Solicitação de compra ${request.protocolNumber} enviada com sucesso.`,
      });

      // Reset form and state
      form.reset();
      setFiles([]);
      onRequestCreated();

    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar solicitação de compra",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white space-y-4">
      <h3 className="text-lg font-medium mb-4">Nova Solicitação de Compra</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o departamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departmentsList.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="justification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Justificativa</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva a justificativa da compra" 
                    className="resize-none min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
              <div key={field.id} className="border rounded-lg p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium">Item {index + 1}</h5>
                  {index > 0 && (
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
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
            ))}

            {form.formState.errors.items?.message && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.items.message}
              </p>
            )}
          </div>

          {/* File attachments section */}
          <div className="mt-4">
            <FormLabel>Anexos (opcional)</FormLabel>
            <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 mt-1">
              <div className="flex flex-col items-center justify-center space-y-2">
                <label className="flex flex-col items-center justify-center cursor-pointer">
                  <Plus className="h-6 w-6 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-1">Adicionar arquivo</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileAdd}
                  />
                </label>
              </div>
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border rounded-md p-2"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <div className="truncate">{file.name}</div>
                        <div className="text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFileRemove(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <SendHorizonal className="mr-2 h-4 w-4" />
                Enviar Solicitação de Compra
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
