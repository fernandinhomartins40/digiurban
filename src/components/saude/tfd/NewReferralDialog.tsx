
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createTFDReferral } from "@/services/health";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  patientName: z.string().min(1, "Nome do paciente é obrigatório"),
  patientCpf: z.string().optional(),
  specialty: z.string().min(1, "Especialidade é obrigatória"),
  destinationCity: z.string().min(1, "Cidade de destino é obrigatória"),
  referralReason: z.string().min(1, "Motivo do encaminhamento é obrigatório"),
  priority: z.enum(["low", "normal", "high", "urgent"], {
    required_error: "Selecione a prioridade",
  }),
  observations: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface NewReferralDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewReferralDialog({ open, onOpenChange }: NewReferralDialogProps) {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      patientCpf: "",
      specialty: "",
      destinationCity: "",
      referralReason: "",
      priority: "normal",
      observations: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createTFDReferral({
        patientName: data.patientName,
        patientCpf: data.patientCpf,
        specialty: data.specialty,
        destinationCity: data.destinationCity,
        referralReason: data.referralReason,
        priority: data.priority,
        observations: data.observations,
        referredBy: "current-user", // This would be replaced with the actual user ID
      });

      toast({
        title: "Encaminhamento criado",
        description: "O encaminhamento TFD foi criado com sucesso.",
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o encaminhamento.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Encaminhamento TFD</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Paciente</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patientCpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF do Paciente</FormLabel>
                    <FormControl>
                      <Input placeholder="000.000.000-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especialidade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a especialidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cardiologia">Cardiologia</SelectItem>
                        <SelectItem value="neurologia">Neurologia</SelectItem>
                        <SelectItem value="oncologia">Oncologia</SelectItem>
                        <SelectItem value="ortopedia">Ortopedia</SelectItem>
                        <SelectItem value="oftalmologia">Oftalmologia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destinationCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade Destino</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a cidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="São Paulo">São Paulo</SelectItem>
                        <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                        <SelectItem value="Campinas">Campinas</SelectItem>
                        <SelectItem value="Ribeirão Preto">Ribeirão Preto</SelectItem>
                        <SelectItem value="Belo Horizonte">Belo Horizonte</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="referralReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo do Encaminhamento</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Descreva o motivo do encaminhamento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações Adicionais</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="Observações adicionais (opcional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Criar Encaminhamento</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
