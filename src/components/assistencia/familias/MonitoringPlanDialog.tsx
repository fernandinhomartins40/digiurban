
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VulnerableFamily, FamilyMonitoringPlan } from "@/types/assistance";

const planSchema = z.object({
  objectives: z.string().min(1, { message: "Os objetivos são obrigatórios" }),
  contact_frequency: z.string().min(1, { message: "A frequência de contato é obrigatória" }),
  actions: z.array(z.string()).min(1, { message: "Adicione pelo menos uma ação" }),
  start_date: z.string().min(1, { message: "A data de início é obrigatória" }),
  end_date: z.string().optional(),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface MonitoringPlanDialogProps {
  open: boolean;
  onClose: () => void;
  family: VulnerableFamily;
}

export function MonitoringPlanDialog({ open, onClose, family }: MonitoringPlanDialogProps) {
  const { toast } = useToast();
  const [actions, setActions] = React.useState<string[]>([]);
  const [newAction, setNewAction] = React.useState('');

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      objectives: "",
      contact_frequency: "",
      actions: [],
      start_date: new Date().toISOString().split('T')[0],
      end_date: "",
    },
  });

  const handleAddAction = () => {
    if (newAction.trim()) {
      setActions([...actions, newAction.trim()]);
      form.setValue("actions", [...actions, newAction.trim()]);
      setNewAction('');
    }
  };

  const handleRemoveAction = (index: number) => {
    const updatedActions = [...actions];
    updatedActions.splice(index, 1);
    setActions(updatedActions);
    form.setValue("actions", updatedActions);
  };

  const onSubmit = async (values: PlanFormValues) => {
    toast({
      title: "Não implementado",
      description: "A funcionalidade de criar planos de acompanhamento ainda será implementada.",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Plano de Acompanhamento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="objectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivos</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva os objetivos do plano de acompanhamento" 
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
              name="contact_frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequência de Contato</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Semanal, Quinzenal, Mensal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actions"
              render={() => (
                <FormItem>
                  <FormLabel>Ações Planejadas</FormLabel>
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Adicione uma ação" 
                      value={newAction}
                      onChange={(e) => setNewAction(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAction())}
                    />
                    <Button type="button" onClick={handleAddAction}>
                      Adicionar
                    </Button>
                  </div>
                  
                  <ul className="mt-2 space-y-1">
                    {actions.map((action, index) => (
                      <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span>{action}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveAction(index)}
                        >
                          Remover
                        </Button>
                      </li>
                    ))}
                  </ul>
                  
                  {actions.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhuma ação adicionada</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Término (opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Criar Plano</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
