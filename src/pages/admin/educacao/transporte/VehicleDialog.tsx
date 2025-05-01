
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createVehicle, updateVehicle } from "@/services/education/transport";
import { Vehicle } from "@/types/education";
import { toast } from "@/hooks/use-toast";

// Define the schema for the form
const vehicleFormSchema = z.object({
  plate: z.string().min(1, "Placa é obrigatória"),
  type: z.string().min(1, "Tipo do veículo é obrigatório"),
  model: z.string().min(1, "Modelo é obrigatório"),
  capacity: z.coerce.number().min(1, "Capacidade deve ser maior que zero"),
  year: z.coerce.number().min(1900, "Ano inválido").max(new Date().getFullYear() + 1, "Ano inválido"),
  isAccessible: z.boolean().default(false),
  driverName: z.string().min(1, "Nome do motorista é obrigatório"),
  driverContact: z.string().min(1, "Contato do motorista é obrigatório"),
  driverLicense: z.string().min(1, "CNH do motorista é obrigatória"),
  monitorName: z.string().optional(),
  monitorContact: z.string().optional(),
  isActive: z.boolean().default(true),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: Vehicle | null;
  onCreated: () => void;
  onUpdated: () => void;
}

export default function VehicleDialog({
  open,
  onOpenChange,
  vehicle,
  onCreated,
  onUpdated,
}: VehicleDialogProps) {
  const isEditing = !!vehicle;
  const title = isEditing ? "Editar Veículo" : "Novo Veículo";

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      plate: vehicle?.plate || "",
      type: vehicle?.type || "",
      model: vehicle?.model || "",
      capacity: vehicle?.capacity || 0,
      year: vehicle?.year || new Date().getFullYear(),
      isAccessible: vehicle?.isAccessible || false,
      driverName: vehicle?.driverName || "",
      driverContact: vehicle?.driverContact || "",
      driverLicense: vehicle?.driverLicense || "",
      monitorName: vehicle?.monitorName || "",
      monitorContact: vehicle?.monitorContact || "",
      isActive: vehicle?.isActive ?? true,
    },
  });

  const onSubmit = async (values: VehicleFormValues) => {
    try {
      if (isEditing && vehicle) {
        // Para update, garantimos que todos os campos estejam presentes
        await updateVehicle(vehicle.id, {
          plate: values.plate,
          type: values.type,
          model: values.model,
          capacity: values.capacity,
          year: values.year,
          isAccessible: values.isAccessible,
          driverName: values.driverName,
          driverContact: values.driverContact,
          driverLicense: values.driverLicense,
          monitorName: values.monitorName,
          monitorContact: values.monitorContact,
          isActive: values.isActive
        });
        toast({
          title: "Sucesso",
          description: "Veículo atualizado com sucesso",
        });
        onUpdated();
      } else {
        // Para criação, garantimos que todos os campos obrigatórios estejam presentes
        await createVehicle({
          plate: values.plate,
          type: values.type,
          model: values.model,
          capacity: values.capacity,
          year: values.year,
          isAccessible: values.isAccessible,
          driverName: values.driverName,
          driverContact: values.driverContact,
          driverLicense: values.driverLicense,
          monitorName: values.monitorName,
          monitorContact: values.monitorContact,
          isActive: values.isActive
        });
        toast({
          title: "Sucesso", 
          description: "Veículo cadastrado com sucesso"
        });
        onCreated();
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar veículo:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar veículo",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="plate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa*</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC-1234" {...field} />
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
                    <FormLabel>Tipo do Veículo*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ônibus, Micro-ônibus, Van..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo*</FormLabel>
                    <FormControl>
                      <Input placeholder="Modelo do veículo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidade*</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Número de assentos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano*</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ano do veículo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isAccessible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md pt-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Acessível para cadeirantes</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="driverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Motorista*</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="driverContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contato do Motorista*</FormLabel>
                    <FormControl>
                      <Input placeholder="Telefone de contato" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="driverLicense"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNH do Motorista*</FormLabel>
                    <FormControl>
                      <Input placeholder="Número da CNH" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monitorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Monitor</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do monitor (opcional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monitorContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contato do Monitor</FormLabel>
                    <FormControl>
                      <Input placeholder="Telefone do monitor (opcional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md pt-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Veículo ativo</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Salvar alterações" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
