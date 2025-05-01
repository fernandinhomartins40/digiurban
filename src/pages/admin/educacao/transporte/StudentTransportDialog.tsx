
import React, { useEffect, useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createStudentTransport, updateStudentTransport } from "@/services/education/transport";
import { StudentTransport, TransportStatus } from "@/types/education";
import { toast } from "@/hooks/use-toast";

// Define the schema for the form
const studentTransportFormSchema = z.object({
  studentId: z.string().min(1, "ID do aluno é obrigatório"),
  routeId: z.string().min(1, "Rota é obrigatória"),
  pickupLocation: z.string().min(1, "Local de embarque é obrigatório"),
  returnLocation: z.string().min(1, "Local de desembarque é obrigatório"),
  schoolId: z.string().min(1, "Escola é obrigatória"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().optional(),
  status: z.enum(["active", "inactive", "pending", "cancelled"]),
});

type StudentTransportFormValues = z.infer<typeof studentTransportFormSchema>;

interface StudentTransportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transport?: StudentTransport | null;
  onCreated: () => void;
  onUpdated: () => void;
}

export default function StudentTransportDialog({
  open,
  onOpenChange,
  transport,
  onCreated,
  onUpdated,
}: StudentTransportDialogProps) {
  const isEditing = !!transport;
  const title = isEditing ? "Editar Transporte de Aluno" : "Adicionar Aluno ao Transporte";

  // For a real implementation, you would fetch this data from the API
  const [loading, setLoading] = useState(false);
  
  const form = useForm<StudentTransportFormValues>({
    resolver: zodResolver(studentTransportFormSchema),
    defaultValues: {
      studentId: transport?.studentId || "",
      routeId: transport?.routeId || "",
      pickupLocation: transport?.pickupLocation || "",
      returnLocation: transport?.returnLocation || "",
      schoolId: transport?.schoolId || "",
      startDate: transport?.startDate ? new Date(transport.startDate).toISOString().split("T")[0] : "",
      endDate: transport?.endDate ? new Date(transport.endDate).toISOString().split("T")[0] : "",
      status: transport?.status || "pending",
    },
  });

  const onSubmit = async (values: StudentTransportFormValues) => {
    try {
      if (isEditing && transport) {
        await updateStudentTransport(transport.id, values);
        toast({
          title: "Sucesso",
          description: "Transporte de aluno atualizado com sucesso",
        });
        onUpdated();
      } else {
        await createStudentTransport(values);
        toast({
          title: "Sucesso", 
          description: "Aluno adicionado ao transporte com sucesso"
        });
        onCreated();
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar transporte de aluno:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar transporte de aluno",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aluno*</FormLabel>
                    <FormControl>
                      <Input placeholder="ID do aluno" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="routeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rota*</FormLabel>
                    <FormControl>
                      <Input placeholder="ID da rota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="schoolId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escola*</FormLabel>
                    <FormControl>
                      <Input placeholder="ID da escola" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pickupLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local de Embarque*</FormLabel>
                    <FormControl>
                      <Input placeholder="Endereço de embarque" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="returnLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local de Desembarque*</FormLabel>
                    <FormControl>
                      <Input placeholder="Endereço de desembarque" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Término</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
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
              <Button type="submit" disabled={loading}>
                {isEditing ? "Salvar alterações" : "Adicionar Aluno"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
