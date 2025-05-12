import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApiMutation } from "@/lib/hooks";
import { createService, updateService } from "@/services/administration/hr/services";
import { HRService, ServiceFormData, ServiceCategory } from "@/types/hr";

const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  category: z.string().min(1, "A categoria é obrigatória"),
  is_active: z.boolean().default(true),
  requires_approval: z.boolean().default(true),
  approval_flow: z.any().optional(),
  form_schema: z.object({
    fields: z.array(
      z.object({
        name: z.string(),
        type: z.string(),
        label: z.string(),
        required: z.boolean(),
      })
    ).default([]),
  }).optional(),
  available_for: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CATEGORIES: ServiceCategory[] = [
  'Tempo',
  'Licenças',
  'Aposentadoria',
  'Transferências',
  'Outros',
];

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: HRService | null;
  onSaved: (service: HRService) => void;
}

export function ServiceFormDialog({
  open,
  onOpenChange,
  service,
  onSaved,
}: ServiceFormDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: service
      ? {
          name: service.name,
          description: service.description || "",
          category: service.category,
          is_active: service.is_active,
          requires_approval: service.requires_approval,
          approval_flow: service.approval_flow,
          form_schema: service.form_schema,
          available_for: service.available_for || [],
        }
      : {
          name: "",
          description: "",
          category: "",
          is_active: true,
          requires_approval: true,
          approval_flow: null,
          form_schema: { fields: [] },
          available_for: [],
        },
  });

  // Create mutation
  const { mutate: create, isPending: isCreating } = useApiMutation(
    async (data: FormValues) => {
      const serviceData: ServiceFormData = {
        name: data.name,
        description: data.description || null,
        category: data.category,
        is_active: data.is_active,
        requires_approval: data.requires_approval,
        approval_flow: data.approval_flow,
        form_schema: data.form_schema || { fields: [] },
        available_for: data.available_for || [],
      };
      
      return createService(serviceData);
    },
    {
      onSuccess: (response) => {
        if (response) {
          onSaved(response);
          form.reset();
        }
      },
    }
  );

  // Update mutation
  const { mutate: update, isPending: isUpdating } = useApiMutation(
    async (data: FormValues) => {
      if (!service) return null;
      
      const serviceData: Partial<ServiceFormData> = {
        name: data.name,
        description: data.description || null,
        category: data.category,
        is_active: data.is_active,
        requires_approval: data.requires_approval,
        approval_flow: data.approval_flow,
        form_schema: data.form_schema || { fields: [] },
        available_for: data.available_for || [],
      };
      
      return updateService(service.id, serviceData);
    },
    {
      onSuccess: (response) => {
        if (response) {
          onSaved(response);
          form.reset();
        }
      },
    }
  );

  function onSubmit(data: FormValues) {
    if (service) {
      update(data);
    } else {
      create(data);
    }
  }

  const isSubmitting = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Serviço</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do serviço" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição do serviço"
                      {...field}
                      value={field.value || ""}
                    />
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
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                    <div className="space-y-0.5">
                      <FormLabel>Serviço Ativo</FormLabel>
                      <FormDescription>
                        Desative para ocultar este serviço
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
                  <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                    <div className="space-y-0.5">
                      <FormLabel>Requer Aprovação</FormLabel>
                      <FormDescription>
                        Requer aprovação de gestores
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : service ? "Atualizar" : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
