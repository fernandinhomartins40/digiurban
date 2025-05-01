
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
import { Checkbox } from "@/components/ui/checkbox";
import { AssistanceCenter, SocialAttendance } from "@/types/assistance";
import { createSocialAttendance } from "@/services/assistance";

const attendanceTypeOptions = [
  { id: "reception", label: "Acolhida" },
  { id: "qualified_listening", label: "Escuta Qualificada" },
  { id: "referral", label: "Encaminhamento" },
  { id: "guidance", label: "Orientação" },
  { id: "follow_up", label: "Acompanhamento" },
  { id: "other", label: "Outro" },
];

const attendanceSchema = z.object({
  citizen_id: z.string().optional(),
  citizen_name: z.string().min(1, { message: "Nome do cidadão é obrigatório" }),
  center_id: z.string().min(1, { message: "Centro é obrigatório" }),
  attendance_type: z.string().min(1, { message: "Tipo de atendimento é obrigatório" }),
  description: z.string().min(1, { message: "Descrição é obrigatória" }),
  referrals: z.string().optional(),
  follow_up_required: z.boolean().default(false),
  follow_up_date: z.string().optional(),
});

type AttendanceFormValues = z.infer<typeof attendanceSchema>;

interface AttendanceDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  centers: AssistanceCenter[];
  attendance?: SocialAttendance | null;
}

export function AttendanceDialog({
  open,
  onClose,
  onSave,
  centers,
  attendance,
}: AttendanceDialogProps) {
  const { toast } = useToast();
  const isEditing = !!attendance;
  const [followUpRequired, setFollowUpRequired] = React.useState(false);

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      citizen_name: "",
      center_id: "",
      attendance_type: "",
      description: "",
      referrals: "",
      follow_up_required: false,
      follow_up_date: "",
    },
  });

  React.useEffect(() => {
    if (attendance) {
      form.reset({
        citizen_id: attendance.citizen_id,
        citizen_name: "Nome do Cidadão", // This would come from a lookup using citizen_id
        center_id: attendance.center_id || "",
        attendance_type: attendance.attendance_type,
        description: attendance.description,
        referrals: attendance.referrals || "",
        follow_up_required: attendance.follow_up_required || false,
        follow_up_date: attendance.follow_up_date ? new Date(attendance.follow_up_date).toISOString().split('T')[0] : "",
      });
      setFollowUpRequired(attendance.follow_up_required || false);
    } else {
      form.reset({
        citizen_name: "",
        center_id: "",
        attendance_type: "",
        description: "",
        referrals: "",
        follow_up_required: false,
        follow_up_date: "",
      });
      setFollowUpRequired(false);
    }
  }, [attendance, form]);

  const onSubmit = async (values: AttendanceFormValues) => {
    try {
      // In a real implementation, we would use the actual citizen_id
      // For now, we're just creating a new attendance
      if (!isEditing) {
        await createSocialAttendance({
          center_id: values.center_id,
          attendance_type: values.attendance_type as any,
          description: values.description,
          referrals: values.referrals,
          follow_up_required: values.follow_up_required,
          follow_up_date: values.follow_up_date ? new Date(values.follow_up_date).toISOString() : undefined,
        });
        
        toast({
          title: "Atendimento registrado",
          description: "O atendimento foi registrado com sucesso.",
        });
      } else {
        // This would be an update in a real implementation
        toast({
          title: "Não implementado",
          description: "A funcionalidade de editar atendimentos ainda será implementada.",
        });
      }
      
      form.reset();
      onSave();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar atendimento:", error);
      toast({
        title: "Erro",
        description: "Houve um erro ao salvar os dados do atendimento.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Atendimento" : "Novo Atendimento"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="citizen_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cidadão</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="center_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Centro de Referência</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um centro" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {centers.map((center) => (
                        <SelectItem key={center.id} value={center.id}>
                          {center.name} ({center.type})
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de atendimento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {attendanceTypeOptions.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
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
                      className="min-h-[100px]"
                      {...field}
                    />
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
                  <FormLabel>Encaminhamentos (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva os encaminhamentos realizados"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="follow_up_required"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        setFollowUpRequired(!!checked);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Requer acompanhamento posterior
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {followUpRequired && (
              <FormField
                control={form.control}
                name="follow_up_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data para Acompanhamento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Atualizar" : "Registrar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
