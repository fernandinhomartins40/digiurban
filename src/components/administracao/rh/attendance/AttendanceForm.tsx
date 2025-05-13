import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useApiMutation } from "@/lib/hooks";
import { useAuth } from "@/contexts/auth/useAuth";
import { createAttendance, updateAttendance } from "@/services/administration/hr/attendances";
import { HRAttendance, HRService } from "@/types/hr";

const formSchema = z.object({
  employeeId: z.string().min(1, "O funcionário é obrigatório"),
  employeeName: z.string().min(1, "O nome do funcionário é obrigatório"),
  serviceId: z.string().optional(),
  description: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AttendanceFormProps {
  services: HRService[];
  initialData?: HRAttendance;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AttendanceForm({ services, initialData, onSuccess, onCancel }: AttendanceFormProps) {
  const { user } = useAuth();
  const activeServices = services.filter(service => service.is_active);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          employeeId: initialData.employeeId,
          employeeName: initialData.employeeName,
          serviceId: initialData.serviceId || "",
          description: initialData.description,
          notes: initialData.notes || "",
        }
      : {
          employeeId: "",
          employeeName: "",
          serviceId: "",
          description: "",
          notes: "",
        },
  });

  const { mutate: submitAttendance, isPending } = useApiMutation(
    async (values: FormValues) => {
      if (!user) throw new Error("User not authenticated");
      
      if (initialData) {
        return await updateAttendance(initialData.id, {
          serviceId: values.serviceId || null,
          description: values.description,
          notes: values.notes,
        });
      } else {
        return await createAttendance({
          employeeId: values.employeeId,
          serviceId: values.serviceId || null,
          description: values.description,
          status: "in_progress",
          attendanceDate: new Date(),
          attendedBy: user.id,
          notes: values.notes,
        });
      }
    },
    {
      onSuccess: () => {
        onSuccess();
        form.reset();
      },
    }
  );

  function onSubmit(values: FormValues) {
    submitAttendance(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID do Funcionário</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="ID do funcionário" 
                    {...field} 
                    disabled={!!initialData} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employeeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Funcionário</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nome do funcionário" 
                    {...field} 
                    disabled={!!initialData} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serviço Relacionado (opcional)</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um serviço (opcional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Nenhum serviço específico</SelectItem>
                  {activeServices.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do Atendimento</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva o atendimento realizado" 
                  {...field} 
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações (opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Observações adicionais" 
                  {...field} 
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : initialData ? "Atualizar" : "Registrar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
