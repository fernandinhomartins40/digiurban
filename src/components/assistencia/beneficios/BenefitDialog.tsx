
// Fix the type in BenefitDialog.tsx by changing how we handle the status field
// Let's update the updateBenefit function to properly convert the status string to BenefitStatus type

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { EmergencyBenefit, BenefitStatus } from "@/types/assistance";
import { updateEmergencyBenefit } from "@/services/assistance";

interface BenefitDialogProps {
  benefit: EmergencyBenefit;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function BenefitDialog({ benefit, open, onClose, onUpdate }: BenefitDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      benefit_type: benefit.benefit_type || "",
      reason: benefit.reason || "",
      status: benefit.status || "pending",
      comments: benefit.comments || "",
      citizen_id: benefit.citizen_id || "",
    },
  });

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      await updateEmergencyBenefit(benefit.id, {
        updated_at: new Date().toISOString(),
        citizen_id: values.citizen_id || undefined,
        status: values.status as BenefitStatus,
        comments: values.comments || undefined,
        benefit_type: values.benefit_type || undefined,
        reason: values.reason || undefined,
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating benefit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar Benefício #{benefit.protocol_number}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="citizen_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidadão (ID)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ID do cidadão" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="benefit_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Benefício</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Tipo de benefício" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Motivo da solicitação" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="approved">Aprovado</SelectItem>
                      <SelectItem value="delivering">Em entrega</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="rejected">Rejeitado</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentários</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Comentários adicionais" />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
