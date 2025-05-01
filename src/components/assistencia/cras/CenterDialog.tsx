import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AssistanceCenter } from "@/types/assistance";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createAssistanceCenter, updateAssistanceCenter } from "@/services/assistance";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  type: z.enum(["CRAS", "CREAS"]),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  neighborhood: z.string().min(2, "Bairro deve ter pelo menos 2 caracteres"),
  city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  state: z.string().length(2, "Estado deve ter 2 caracteres"),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  coordinator_name: z.string().optional(),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface CenterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  center?: AssistanceCenter;
  onSuccess: () => void;
}

export default function CenterDialog({
  isOpen,
  onClose,
  center,
  onSuccess,
}: CenterDialogProps) {
  const { toast } = useToast();
  const isEditing = !!center;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: center?.name || "",
      type: (center?.type as "CRAS" | "CREAS") || "CRAS",
      address: center?.address || "",
      neighborhood: center?.neighborhood || "",
      city: center?.city || "",
      state: center?.state || "",
      phone: center?.phone || "",
      email: center?.email || "",
      coordinator_name: center?.coordinator_name || "",
      is_active: center?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (center) {
      form.reset({
        name: center.name,
        type: center.type as "CRAS" | "CREAS",
        address: center.address,
        neighborhood: center.neighborhood,
        city: center.city,
        state: center.state,
        phone: center.phone || "",
        email: center.email || "",
        coordinator_name: center.coordinator_name || "",
        is_active: center.is_active,
      });
    } else {
      form.reset({
        name: "",
        type: "CRAS",
        address: "",
        neighborhood: "",
        city: "",
        state: "",
        phone: "",
        email: "",
        coordinator_name: "",
        is_active: true,
      });
    }
  }, [center, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing && center) {
        await updateAssistanceCenter(center.id, values);
        toast({
          title: "Sucesso",
          description: "Centro de assistência atualizado com sucesso",
        });
      } else {
        await createAssistanceCenter({
          name: values.name,
          type: values.type,
          address: values.address,
          neighborhood: values.neighborhood,
          city: values.city,
          state: values.state,
          phone: values.phone,
          email: values.email,
          coordinator_name: values.coordinator_name,
          is_active: values.is_active,
        });
        toast({
          title: "Sucesso",
          description: "Centro de assistência cadastrado com sucesso",
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar centro de assistência:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o centro de assistência",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Centro de Assistência" : "Novo Centro de Assistência"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados do centro de assistência"
              : "Preencha os dados para cadastro do centro de assistência"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do centro" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CRAS">CRAS</SelectItem>
                          <SelectItem value="CREAS">CREAS</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Endereço completo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Bairro" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Cidade" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="UF" maxLength={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Telefone de contato" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Email de contato" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="coordinator_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coordenador</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome do coordenador" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Centro Ativo
                    </FormLabel>
                    <FormDescription>
                      Determina se o centro está ativo ou não
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

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Atualizar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
