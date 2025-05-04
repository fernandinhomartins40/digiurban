
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { Textarea } from "@/components/ui/textarea";
import { format, set } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Appointment, AppointmentStatus } from "@/types/mayorOffice";
import { useAuth } from "@/contexts/AuthContext";

// Form schema
const appointmentFormSchema = z.object({
  subject: z.string().min(3, { message: "O assunto deve ter pelo menos 3 caracteres" }),
  requesterName: z.string().min(3, { message: "O nome do solicitante deve ter pelo menos 3 caracteres" }),
  requesterEmail: z.string().email({ message: "Digite um email válido" }),
  requestedDate: z.date({ required_error: "Selecione uma data para o agendamento" }),
  requestedTime: z.string({ required_error: "Selecione um horário para o agendamento" }),
  durationMinutes: z.number().min(15).default(30),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  description: z.string().optional(),
  location: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

// Mock function to create an appointment (replace with real API call)
const createAppointment = async (data: AppointmentFormValues): Promise<Appointment> => {
  // This would be replaced with an actual API call
  return {
    id: Math.random().toString(36).substring(7),
    status: "pending" as AppointmentStatus,
    subject: data.subject,
    requesterName: data.requesterName, // Make sure requesterName is always provided
    requesterEmail: data.requesterEmail,
    requesterPhone: "",  // Provide default value for required fields
    requestedDate: data.requestedDate,
    requestedTime: data.requestedTime,
    durationMinutes: data.durationMinutes,
    priority: data.priority,
    description: data.description || "",
    location: data.location || "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

interface NewAppointmentDrawerProps {
  onSuccess?: () => void;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

export function NewAppointmentDrawer({ 
  onSuccess, 
  buttonVariant = "default", 
  className = ""
}: NewAppointmentDrawerProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  
  // Setup form with default values
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      subject: "",
      requesterName: user?.name || "",
      requesterEmail: user?.email || "",
      durationMinutes: 30,
      priority: "normal",
      description: "",
      location: "",
    },
  });

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mayorAppointments"] });
      toast({
        title: "Agendamento criado",
        description: "O agendamento foi criado com sucesso",
      });
      setOpen(false);
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar agendamento",
        description: error.message || "Ocorreu um erro ao criar o agendamento",
        variant: "destructive",
      });
    },
  });

  // Form submission
  const onSubmit = (data: AppointmentFormValues) => {
    createAppointmentMutation.mutate(data);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant={buttonVariant as any} 
          className={className}
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90%] sm:max-w-[600px] overflow-y-auto max-h-[85vh]">
        <SheetHeader>
          <SheetTitle>Novo Agendamento</SheetTitle>
          <SheetDescription>
            Preencha os campos para criar um novo agendamento com o prefeito.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assunto</FormLabel>
                    <FormControl>
                      <Input placeholder="Assunto do agendamento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requesterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Solicitante</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requesterEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email do Solicitante</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requestedDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data do Agendamento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) => date < new Date()}
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requestedTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um horário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, hour) => {
                            if (hour < 8 || hour > 17) return null;
                            return (
                              <React.Fragment key={hour}>
                                <SelectItem value={`${hour.toString().padStart(2, '0')}:00`}>
                                  {hour.toString().padStart(2, '0')}:00
                                </SelectItem>
                                <SelectItem value={`${hour.toString().padStart(2, '0')}:30`}>
                                  {hour.toString().padStart(2, '0')}:30
                                </SelectItem>
                              </React.Fragment>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração (minutos)</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Duração" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="45">45 minutos</SelectItem>
                          <SelectItem value="60">1 hora</SelectItem>
                          <SelectItem value="90">1 hora e 30 minutos</SelectItem>
                          <SelectItem value="120">2 horas</SelectItem>
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local</FormLabel>
                    <FormControl>
                      <Input placeholder="Local do agendamento" {...field} />
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
                        placeholder="Descreva o motivo do agendamento" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <SheetFooter className="pt-4">
                <Button 
                  type="submit" 
                  disabled={createAppointmentMutation.isPending}
                  className="w-full"
                >
                  {createAppointmentMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    "Criar Agendamento"
                  )}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
