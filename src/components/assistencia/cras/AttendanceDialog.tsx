
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import * as z from "zod";
import { SocialAttendance, AssistanceCenter, AttendanceType } from "@/types/assistance";
import { createSocialAttendance, updateSocialAttendance } from "@/services/assistance/index";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  center_id: z.string().min(1, "Selecione um centro"),
  attendance_type: z.string().min(1, "Selecione o tipo de atendimento"),
  attendance_date: z.date().optional(),
  description: z.string().min(1, "Descrição é obrigatória"),
  referrals: z.string().optional(),
  follow_up_required: z.boolean().default(false),
  follow_up_date: z.date().optional(),
});

interface AttendanceDialogProps {
  attendance: SocialAttendance | null;
  centers: AssistanceCenter[];
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function AttendanceDialog({
  attendance,
  centers,
  open,
  onClose,
  onSave,
}: AttendanceDialogProps) {
  const { toast } = useToast();
  const isEditing = !!attendance;
  
  const [followUpRequired, setFollowUpRequired] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      center_id: "",
      attendance_type: "",
      attendance_date: new Date(),
      description: "",
      referrals: "",
      follow_up_required: false,
      follow_up_date: undefined,
    },
  });

  useEffect(() => {
    if (attendance) {
      form.reset({
        center_id: attendance.center_id || "",
        attendance_type: attendance.attendance_type || "",
        attendance_date: attendance.attendance_date ? new Date(attendance.attendance_date) : new Date(),
        description: attendance.description || "",
        referrals: attendance.referrals || "",
        follow_up_required: attendance.follow_up_required || false,
        follow_up_date: attendance.follow_up_date ? new Date(attendance.follow_up_date) : undefined,
      });
      setFollowUpRequired(attendance.follow_up_required || false);
    } else {
      form.reset({
        center_id: "",
        attendance_type: "",
        attendance_date: new Date(),
        description: "",
        referrals: "",
        follow_up_required: false,
        follow_up_date: undefined,
      });
      setFollowUpRequired(false);
    }
  }, [attendance, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEditing && attendance) {
        await updateSocialAttendance(attendance.id, {
          ...values,
          attendance_date: values.attendance_date ? format(values.attendance_date, "yyyy-MM-dd") : undefined,
          follow_up_date: values.follow_up_date ? format(values.follow_up_date, "yyyy-MM-dd") : undefined,
          // Cast the string value to AttendanceType to fix the error
          attendance_type: values.attendance_type as AttendanceType
        });
        
        toast({
          title: "Atendimento atualizado",
          description: "O atendimento foi atualizado com sucesso.",
        });
      } else {
        // Create new attendance - modified to remove protocol_number which is auto-generated
        const attendanceData = {
          center_id: values.center_id,
          // Cast the string value to AttendanceType to fix the error
          attendance_type: values.attendance_type as AttendanceType,
          attendance_date: values.attendance_date ? format(values.attendance_date, "yyyy-MM-dd") : undefined,
          description: values.description,
          referrals: values.referrals || "",
          follow_up_required: values.follow_up_required,
          follow_up_date: values.follow_up_date ? format(values.follow_up_date, "yyyy-MM-dd") : undefined,
        };

        await createSocialAttendance(attendanceData);
        
        toast({
          title: "Atendimento registrado",
          description: "O atendimento foi registrado com sucesso.",
        });
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o atendimento.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Atendimento" : "Novo Atendimento"}</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para {isEditing ? "editar" : "criar"} um atendimento.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="center_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Centro de Referência</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um centro" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {centers.map((center) => (
                        <SelectItem key={center.id} value={center.id}>
                          {center.name}
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
              name="attendance_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Atendimento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de atendimento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="reception">Recepção</SelectItem>
                      <SelectItem value="qualified_listening">Escuta Qualificada</SelectItem>
                      <SelectItem value="referral">Encaminhamento</SelectItem>
                      <SelectItem value="guidance">Orientação</SelectItem>
                      <SelectItem value="follow_up">Acompanhamento</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attendance_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data do Atendimento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PP")
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
                        disabled={(date) =>
                          date > new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                    <Textarea placeholder="Descreva o atendimento realizado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="referrals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Encaminhamentos</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Para quais serviços/programas a pessoa foi encaminhada?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between rounded-md border p-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium leading-none">Necessário acompanhamento?</h4>
                <p className="text-sm text-muted-foreground">
                  Indique se é necessário realizar acompanhamento do caso.
                </p>
              </div>
              <FormField
                control={form.control}
                name="follow_up_required"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch
                        checked={followUpRequired}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          setFollowUpRequired(checked);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {followUpRequired && (
              <FormField
                control={form.control}
                name="follow_up_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Acompanhamento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PP")
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
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="submit">{isEditing ? "Salvar" : "Criar"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
