
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { EmergencyBenefit } from "@/types/assistance";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth/useAuth";
import { Separator } from "@/components/ui/separator";
import AttachmentUpload from "./AttachmentUpload";
import { createEmergencyBenefit, updateEmergencyBenefit } from "@/services/assistance";

const formSchema = z.object({
  citizen_id: z.string().min(1, "ID do cidadão é obrigatório"),
  reason: z.string().min(10, "Motivo deve ter pelo menos 10 caracteres"),
  benefit_type: z.string().min(2, "Tipo de benefício é obrigatório"),
  comments: z.string().optional(),
  status: z.string(),
});

interface BenefitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  benefit?: EmergencyBenefit;
  onSuccess: () => void;
}

export default function BenefitDialog({
  isOpen,
  onClose,
  benefit,
  onSuccess,
}: BenefitDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditing = !!benefit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      citizen_id: benefit?.citizen_id || "",
      reason: benefit?.reason || "",
      benefit_type: benefit?.benefit_type || "",
      comments: benefit?.comments || "",
      status: benefit?.status || "pending",
    },
  });

  React.useEffect(() => {
    if (benefit) {
      form.reset({
        citizen_id: benefit.citizen_id,
        reason: benefit.reason,
        benefit_type: benefit.benefit_type,
        comments: benefit.comments || "",
        status: benefit.status,
      });
    } else {
      form.reset({
        citizen_id: "",
        reason: "",
        benefit_type: "",
        comments: "",
        status: "pending",
      });
    }
  }, [benefit, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar autenticado para realizar esta ação",
          variant: "destructive",
        });
        return;
      }

      if (isEditing && benefit) {
        await updateEmergencyBenefit(benefit.id, {
          ...values,
          updated_at: new Date().toISOString(),
        });
        toast({
          title: "Sucesso",
          description: "Benefício atualizado com sucesso",
        });
      } else {
        await createEmergencyBenefit({
          citizen_id: values.citizen_id,
          reason: values.reason,
          benefit_type: values.benefit_type,
          status: values.status as any,
          comments: values.comments,
          request_date: new Date().toISOString(),
        });
        toast({
          title: "Sucesso",
          description: "Benefício cadastrado com sucesso",
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar benefício:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o benefício",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Benefício" : "Novo Benefício"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados do benefício emergencial"
              : "Preencha os dados para registro do benefício emergencial"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="citizen_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID do Cidadão</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isEditing} />
                  </FormControl>
                  <FormDescription>
                    ID do cidadão beneficiário
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="benefit_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Benefício</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de benefício" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic_basket">Cesta Básica</SelectItem>
                          <SelectItem value="hygiene_kit">Kit de Higiene</SelectItem>
                          <SelectItem value="blanket">Cobertor</SelectItem>
                          <SelectItem value="mattress">Colchão</SelectItem>
                          <SelectItem value="clothing">Roupa</SelectItem>
                          <SelectItem value="emergency_housing">Moradia Emergencial</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="approved">Aprovado</SelectItem>
                          <SelectItem value="delivering">Em Entrega</SelectItem>
                          <SelectItem value="completed">Concluído</SelectItem>
                          <SelectItem value="rejected">Rejeitado</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo da Solicitação</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Descreva o motivo da solicitação do benefício"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Observações adicionais"
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEditing && benefit && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Anexos</h3>
                  <AttachmentUpload benefitId={benefit.id} />
                </div>
              </>
            )}

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Atualizar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
