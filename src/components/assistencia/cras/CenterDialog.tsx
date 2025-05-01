
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { AssistanceCenter } from "@/types/assistance";
import { createAssistanceCenter, updateAssistanceCenter } from "@/services/assistance";

interface CenterDialogProps {
  center?: AssistanceCenter;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function CenterDialog({ center, open, onClose, onSave }: CenterDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!center?.id;

  const form = useForm({
    defaultValues: {
      name: center?.name || "",
      type: center?.type || "CRAS",
      address: center?.address || "",
      neighborhood: center?.neighborhood || "",
      city: center?.city || "",
      state: center?.state || "",
      phone: center?.phone || "",
      email: center?.email || "",
      coordinator_name: center?.coordinator_name || "",
      is_active: center?.is_active !== false, // Default to true if not specified
    },
  });

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      // Make sure we have all required fields for a new center
      if (!isEditing && (!values.name || !values.type || !values.address || !values.neighborhood || !values.city || !values.state)) {
        throw new Error("Todos os campos obrigatórios devem ser preenchidos");
      }

      const centerData = {
        name: values.name,
        type: values.type as "CRAS" | "CREAS",
        address: values.address,
        neighborhood: values.neighborhood,
        city: values.city,
        state: values.state,
        phone: values.phone || undefined,
        email: values.email || undefined,
        coordinator_name: values.coordinator_name || undefined,
        is_active: values.is_active,
      };

      if (isEditing && center) {
        await updateAssistanceCenter(center.id, centerData);
      } else {
        await createAssistanceCenter(centerData as Omit<AssistanceCenter, "id" | "created_at" | "updated_at">);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving center:", error);
      // TODO: Show error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Centro" : "Novo Centro"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Centro*</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome do centro" required />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CRAS">CRAS</SelectItem>
                      <SelectItem value="CREAS">CREAS</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Endereço completo" required />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Bairro" required />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Cidade" required />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Estado" required />
                    </FormControl>
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
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="E-mail de contato" type="email" />
                    </FormControl>
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
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                  <div>
                    <FormLabel>Centro Ativo</FormLabel>
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
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar Centro"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
