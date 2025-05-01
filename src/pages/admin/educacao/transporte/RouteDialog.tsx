
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
import { createTransportRoute, updateTransportRoute, getVehicles } from "@/services/education/transport";
import { TransportRoute } from "@/types/education";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the schema for the form
const routeFormSchema = z.object({
  name: z.string().min(1, "Nome da rota é obrigatório"),
  vehicleId: z.string().min(1, "Veículo é obrigatório"),
  origin: z.string().min(1, "Local de origem é obrigatório"),
  destination: z.string().min(1, "Local de destino é obrigatório"),
  schoolIds: z.array(z.string()).min(1, "Pelo menos uma escola deve ser selecionada"),
  departureTime: z.string().min(1, "Horário de saída é obrigatório"),
  returnTime: z.string().min(1, "Horário de retorno é obrigatório"),
  distance: z.coerce.number().optional(),
  averageDuration: z.coerce.number().optional(),
  maxCapacity: z.coerce.number().min(1, "Capacidade máxima deve ser maior que zero"),
  isActive: z.boolean().default(true),
});

type RouteFormValues = z.infer<typeof routeFormSchema>;

interface RouteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  route?: TransportRoute | null;
  onCreated: () => void;
  onUpdated: () => void;
}

export default function RouteDialog({
  open,
  onOpenChange,
  route,
  onCreated,
  onUpdated,
}: RouteDialogProps) {
  const isEditing = !!route;
  const title = isEditing ? "Editar Rota" : "Nova Rota";
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch vehicles for the dropdown
  useEffect(() => {
    async function loadVehicles() {
      setLoading(true);
      try {
        const result = await getVehicles();
        setVehicles(result.filter(v => v.isActive));
      } catch (error) {
        console.error("Error loading vehicles:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os veículos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    if (open) {
      loadVehicles();
    }
  }, [open]);

  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeFormSchema),
    defaultValues: {
      name: route?.name || "",
      vehicleId: route?.vehicleId || "",
      origin: route?.origin || "",
      destination: route?.destination || "",
      schoolIds: route?.schoolIds || [],
      departureTime: route?.departureTime || "",
      returnTime: route?.returnTime || "",
      distance: route?.distance || undefined,
      averageDuration: route?.averageDuration || undefined,
      maxCapacity: route?.maxCapacity || 0,
      isActive: route?.isActive ?? true,
    },
  });

  const onSubmit = async (values: RouteFormValues) => {
    try {
      if (isEditing && route) {
        await updateTransportRoute(route.id, values);
        toast({
          title: "Sucesso",
          description: "Rota atualizada com sucesso",
        });
        onUpdated();
      } else {
        // For simplicity in this example, we're setting currentStudents to 0
        const newRoute = {
          ...values,
          currentStudents: 0
        };
        await createTransportRoute(newRoute);
        toast({
          title: "Sucesso", 
          description: "Rota cadastrada com sucesso"
        });
        onCreated();
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar rota:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar rota",
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Rota*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Linha Centro-Norte" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="vehicleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veículo*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um veículo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicles.map(vehicle => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.plate} - {vehicle.model} ({vehicle.capacity} lugares)
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
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local de Origem*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Terminal Central" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local de Destino*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Escola Municipal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="departureTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário de Saída*</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="returnTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário de Retorno*</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maxCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidade Máxima*</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Número máximo de alunos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distância (km)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="Distância em km" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="averageDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração Média (min)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Duração em minutos" {...field} />
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
                      <FormLabel>Rota ativa</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            {/* For simplicity, we're using a hidden field for schoolIds.
                In a real application, you would implement a proper multi-select for schools */}
            <FormField
              control={form.control}
              name="schoolIds"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} value={JSON.stringify(field.value)} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {isEditing ? "Salvar alterações" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
