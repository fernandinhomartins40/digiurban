
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { HRService, ServiceFormData, ServiceCategory } from "@/types/hr";
import { Field, FieldGroup, FieldDefinition } from "@/components/administracao/rh/services/ServiceFieldEditor";

// Define schema for form validation
const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional().nullable(),
  category: z.string(),
  is_active: z.boolean().default(true),
  requires_approval: z.boolean().default(true),
  form_schema: z.object({
    fields: z.array(
      z.object({
        name: z.string(),
        type: z.string(),
        label: z.string(),
        required: z.boolean()
      })
    )
  }).optional().nullable()
});

interface ServiceFormProps {
  initialData?: HRService;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [fields, setFields] = useState<FieldDefinition[]>(
    initialData?.form_schema?.fields || []
  );

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      category: initialData?.category || "Outros",
      is_active: initialData?.is_active ?? true,
      requires_approval: initialData?.requires_approval ?? true,
      form_schema: {
        fields: initialData?.form_schema?.fields || []
      },
      available_for: initialData?.available_for || [],
    }
  });

  const handleAddField = (field: FieldDefinition) => {
    setFields((prev) => [...prev, field]);
  };

  const handleDeleteField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateField = (index: number, field: FieldDefinition) => {
    setFields((prev) => {
      const newFields = [...prev];
      newFields[index] = field;
      return newFields;
    });
  };

  const handleSubmit = async (data: ServiceFormData) => {
    // Add the fields to the form_schema
    const formData: ServiceFormData = {
      ...data,
      form_schema: {
        fields
      }
    };

    await onSubmit(formData);
  };

  const SERVICE_CATEGORIES: ServiceCategory[] = [
    'Tempo',
    'Licenças',
    'Aposentadoria',
    'Transferências',
    'Outros'
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialData ? 'Editar Serviço' : 'Novo Serviço'}</CardTitle>
        <CardDescription>
          {initialData
            ? 'Atualize as informações do serviço'
            : 'Preencha os campos para criar um novo serviço'}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Serviço</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Férias" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SERVICE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o serviço..."
                      className="resize-none h-20"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Serviço Ativo</FormLabel>
                      <FormDescription>
                        Determina se o serviço está disponível para solicitação.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requires_approval"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Requer Aprovação</FormLabel>
                      <FormDescription>
                        Determina se o serviço requer aprovação administrativa.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="font-medium text-sm">Campos do Formulário</div>
              <FieldGroup
                fields={fields}
                onAddField={handleAddField}
                onDeleteField={handleDeleteField}
                onUpdateField={handleUpdateField}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : initialData ? "Atualizar" : "Criar"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
