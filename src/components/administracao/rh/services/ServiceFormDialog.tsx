
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createService } from "@/services/administration/hr/services";
import { toast } from "@/hooks/use-toast";
import { ServiceCategory } from "@/types/hr";
import { useApiMutation } from "@/lib/hooks/useApiMutation";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  form_schema: z.object({
    fields: z.array(
      z.object({
        name: z.string(),
        type: z.string(),
        label: z.string(),
        required: z.boolean(),
      })
    ).default([]),
  }).default({ fields: [] }),
  is_active: z.boolean().default(true),
  requires_approval: z.boolean().default(true),
  approval_flow: z.any().nullable().default(null),
  available_for: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onServiceCreated: () => void;
}

const ServiceFormDialog: React.FC<ServiceFormDialogProps> = ({ 
  open, 
  onOpenChange,
  onServiceCreated
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      is_active: true,
      requires_approval: true,
      form_schema: { fields: [] },
      approval_flow: null,
      available_for: [],
    },
  });

  const createServiceMutation = useApiMutation(
    "createService",
    (data) => createService(data),
    {
      onSuccess: () => {
        toast({
          title: "Serviço criado",
          description: "O serviço foi criado com sucesso.",
        });
        form.reset();
        onOpenChange(false);
        onServiceCreated();
      },
      onError: (error) => {
        console.error("Error creating service:", error);
        toast({
          title: "Erro ao criar serviço",
          description: "Ocorreu um erro ao criar o serviço.",
          variant: "destructive",
        });
      },
    }
  );

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    createServiceMutation.mutate(data);
    setIsSubmitting(false);
  };

  const categories: ServiceCategory[] = [
    "Tempo",
    "Licenças",
    "Aposentadoria",
    "Transferências",
    "Outros",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Serviço</DialogTitle>
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
                      placeholder="Digite a descrição do serviço" 
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
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

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceFormDialog;
