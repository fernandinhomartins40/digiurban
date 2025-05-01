
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VulnerableFamily } from "@/types/assistance";
import { createVulnerableFamily, updateVulnerableFamily } from "@/services/assistance";
import { Checkbox } from "@/components/ui/checkbox";

const vulnerabilityCriteriaOptions = [
  { id: "income", label: "Baixa Renda" },
  { id: "housing", label: "Problemas de Habitação" },
  { id: "education", label: "Baixa Escolaridade" },
  { id: "domestic_violence", label: "Violência Doméstica" },
  { id: "health", label: "Problemas de Saúde" },
  { id: "unemployment", label: "Desemprego" },
  { id: "food_insecurity", label: "Insegurança Alimentar" },
  { id: "other", label: "Outros" },
];

const statusOptions = [
  { id: "monitoring", label: "Em Monitoramento" },
  { id: "stable", label: "Estável" },
  { id: "critical", label: "Crítico" },
  { id: "improved", label: "Melhorado" },
  { id: "completed", label: "Concluído" },
];

const familySchema = z.object({
  family_name: z.string().min(1, { message: "Nome da família é obrigatório" }),
  address: z.string().min(1, { message: "Endereço é obrigatório" }),
  neighborhood: z.string().min(1, { message: "Bairro é obrigatório" }),
  city: z.string().min(1, { message: "Cidade é obrigatória" }),
  state: z.string().min(1, { message: "Estado é obrigatório" }),
  family_status: z.string().optional(),
  vulnerability_criteria: z.array(z.string()).min(1, { message: "Selecione pelo menos um critério de vulnerabilidade" }),
});

type FamilyFormValues = z.infer<typeof familySchema>;

interface FamilyDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  family?: VulnerableFamily | null;
}

export function FamilyDialog({ open, onClose, onSave, family }: FamilyDialogProps) {
  const { toast } = useToast();
  const isEditing = !!family;

  const form = useForm<FamilyFormValues>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      family_name: family?.family_name || "",
      address: family?.address || "",
      neighborhood: family?.neighborhood || "",
      city: family?.city || "",
      state: family?.state || "",
      family_status: family?.family_status || "monitoring",
      vulnerability_criteria: family?.vulnerability_criteria || [],
    },
  });

  const onSubmit = async (values: FamilyFormValues) => {
    try {
      if (isEditing && family) {
        await updateVulnerableFamily(family.id, values);
        toast({
          title: "Família atualizada",
          description: "Os dados da família foram atualizados com sucesso.",
        });
      } else {
        await createVulnerableFamily(values);
        toast({
          title: "Família cadastrada",
          description: "Nova família cadastrada com sucesso.",
        });
      }
      form.reset();
      onSave();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar família:", error);
      toast({
        title: "Erro",
        description: "Houve um erro ao salvar os dados da família.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Família" : "Nova Família"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="family_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Família</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Família Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua, número, complemento" {...field} />
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
                      <Input placeholder="Bairro" {...field} />
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
                      <Input placeholder="Cidade" {...field} />
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
                      <Input placeholder="Estado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="family_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status da Família</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.id} value={status.id}>
                          {status.label}
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
              name="vulnerability_criteria"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Critérios de Vulnerabilidade</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {vulnerabilityCriteriaOptions.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="vulnerability_criteria"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
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
