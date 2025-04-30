
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createTFDTransport } from "@/services/health";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  vehicleId: z.string().min(1, "Veículo é obrigatório"),
  vehicleDescription: z.string().min(1, "Descrição do veículo é obrigatória"),
  driverId: z.string().min(1, "Motorista é obrigatório"),
  driverName: z.string().min(1, "Nome do motorista é obrigatório"),
  departureDate: z.string().min(1, "Data de saída é obrigatória"),
  departureTime: z.string().min(1, "Hora de saída é obrigatória"),
  returnDate: z.string().optional(),
  returnTime: z.string().optional(),
  capacity: z.number().min(1, "Capacidade deve ser no mínimo 1"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface NewTransportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewTransportDialog({ open, onOpenChange }: NewTransportDialogProps) {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleId: "",
      vehicleDescription: "",
      driverId: "",
      driverName: "",
      departureDate: "",
      departureTime: "",
      returnDate: "",
      returnTime: "",
      capacity: 1,
      notes: "",
    },
  });

  const vehicleOptions = [
    { id: "van-1", description: "Van 1 - Fiat Ducato (12 lugares)" },
    { id: "van-2", description: "Van 2 - Mercedes Sprinter (15 lugares)" },
    { id: "ambulancia", description: "Ambulância - Fiat Doblo" },
  ];

  const driverOptions = [
    { id: "driver-1", name: "Carlos Silva" },
    { id: "driver-2", name: "Roberto Alves" },
    { id: "driver-3", name: "Marcos Santos" },
  ];

  const handleVehicleChange = (value: string) => {
    const vehicle = vehicleOptions.find(v => v.id === value);
    if (vehicle) {
      form.setValue("vehicleId", vehicle.id);
      form.setValue("vehicleDescription", vehicle.description);
      
      // Set capacity based on the vehicle
      if (value === "ambulancia") {
        form.setValue("capacity", 1);
      } else if (value === "van-1") {
        form.setValue("capacity", 12);
      } else if (value === "van-2") {
        form.setValue("capacity", 15);
      }
    }
  };

  const handleDriverChange = (value: string) => {
    const driver = driverOptions.find(d => d.id === value);
    if (driver) {
      form.setValue("driverId", driver.id);
      form.setValue("driverName", driver.name);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      await createTFDTransport({
        vehicleId: data.vehicleId,
        vehicleDescription: data.vehicleDescription,
        driverId: data.driverId,
        driverName: data.driverName,
        departureDate: data.departureDate,
        departureTime: data.departureTime,
        returnDate: data.returnDate,
        returnTime: data.returnTime,
        capacity: data.capacity,
        occupiedSeats: 0,
        notes: data.notes,
      });

      toast({
        title: "Transporte criado",
        description: "O transporte TFD foi criado com sucesso.",
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o transporte.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Transporte TFD</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehicleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veículo</FormLabel>
                    <Select 
                      onValueChange={handleVehicleChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o veículo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicleOptions.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.description}
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
                name="driverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motorista</FormLabel>
                    <Select 
                      onValueChange={handleDriverChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o motorista" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {driverOptions.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name}
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
                name="departureDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de saída</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <FormLabel>Hora de saída</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de retorno (opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <FormLabel>Hora de retorno (opcional)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
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
                    <FormLabel>Capacidade</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Observações sobre o transporte" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Criar Transporte</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
