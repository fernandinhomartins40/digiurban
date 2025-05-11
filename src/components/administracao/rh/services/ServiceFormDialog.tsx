
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { HRService, ServiceFormData, ServiceCategory } from "@/types/hr";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createService, updateService } from "@/services/administration/hr/services";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const serviceCategories: ServiceCategory[] = [
  "Tempo", "Licenças", "Aposentadoria", "Transferências", "Outros"
];

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  is_active: z.boolean().default(true),
  requires_approval: z.boolean().default(true),
});

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceToEdit?: HRService;
  onServiceCreated?: () => void;
}

const ServiceFormDialog: React.FC<ServiceFormDialogProps> = ({
  open,
  onOpenChange,
  serviceToEdit,
  onServiceCreated
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: serviceToEdit?.name || "",
      description: serviceToEdit?.description || "",
      category: serviceToEdit?.category || "",
      is_active: serviceToEdit?.is_active ?? true,
      requires_approval: serviceToEdit?.requires_approval ?? true,
    },
  });

  useEffect(() => {
    if (serviceToEdit) {
      form.reset({
        name: serviceToEdit.name,
        description: serviceToEdit.description || "",
        category: serviceToEdit.category,
        is_active: serviceToEdit.is_active,
        requires_approval: serviceToEdit.requires_approval,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        category: "",
        is_active: true,
        requires_approval: true,
      });
    }
  }, [serviceToEdit, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const serviceData: ServiceFormData = {
        name: values.name,
        description: values.description || null,
        category: values.category,
        is_active: values.is_active,
        requires_approval: values.requires_approval,
        form_schema: serviceToEdit?.form_schema || { fields: [] },
        approval_flow: serviceToEdit?.approval_flow || null,
        available_for: serviceToEdit?.available_for || [],
      };

      let result;
      if (serviceToEdit) {
        result = await updateService(serviceToEdit.id, serviceData);
      } else {
        result = await createService(serviceData);
      }

      if (result) {
        toast({
          title: serviceToEdit ? "Serviço atualizado" : "Serviço criado",
          description: serviceToEdit
            ? "O serviço foi atualizado com sucesso."
            : "O serviço foi criado com sucesso.",
        });
        onOpenChange(false);
        if (onServiceCreated) {
          onServiceCreated();
        }
      } else {
        throw new Error("Falha ao salvar o serviço.");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar o serviço.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {serviceToEdit ? "Editar Serviço" : "Novo Serviço"}
          </DialogTitle>
          <DialogDescription>
            {serviceToEdit
              ? "Edite as informações do serviço."
              : "Preencha os dados para criar um novo serviço."}
          </DialogDescription>
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
                    <Input placeholder="Digite o nome do serviço" {...field} />
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
                      placeholder="Digite uma descrição para o serviço"
                      className="resize-none"
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
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {serviceCategories.map((category) => (
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
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Ativo</FormLabel>
                      <p className="text-muted-foreground text-xs">
                        O serviço está disponível para solicitação
                      </p>
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
                      <FormLabel>Requer aprovação</FormLabel>
                      <p className="text-muted-foreground text-xs">
                        O serviço requer fluxo de aprovação
                      </p>
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
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : serviceToEdit ? (
                  "Atualizar"
                ) : (
                  "Criar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceFormDialog;
