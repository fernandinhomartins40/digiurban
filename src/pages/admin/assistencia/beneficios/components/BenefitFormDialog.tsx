
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { createBenefit } from '@/services/assistance';
import { useToast } from '@/hooks/use-toast';
import { EmergencyBenefit } from '@/types/assistance';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Define the validation schema for the form
const benefitFormSchema = z.object({
  benefit_type: z.string().min(1, { message: "Tipo de benefício é obrigatório" }),
  reason: z.string().min(3, { message: "Motivo é obrigatório" }),
  citizen_name: z.string().min(3, { message: "Nome do cidadão é obrigatório" }),
  citizen_id: z.string().optional(),
  comments: z.string().optional(),
});

type BenefitFormValues = z.infer<typeof benefitFormSchema>;

// Predefined benefit types
const BENEFIT_TYPES = [
  "Cesta Básica",
  "Auxílio Moradia",
  "Auxílio Funeral",
  "Kit Maternidade",
  "Kit Escolar",
  "Material de Construção",
  "Colchão",
  "Cobertor",
  "Medicamento",
  "Transporte",
  "Outro"
];

interface BenefitFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBenefitCreated?: () => void;
}

export function BenefitFormDialog({ 
  open, 
  onOpenChange,
  onBenefitCreated 
}: BenefitFormDialogProps) {
  const { toast } = useToast();
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<BenefitFormValues>({
    resolver: zodResolver(benefitFormSchema),
    defaultValues: {
      benefit_type: "",
      reason: "",
      citizen_name: "",
      citizen_id: "",
      comments: "",
    },
  });
  
  // Mutation for creating a new benefit
  const createBenefitMutation = useMutation({
    mutationFn: (data: Partial<EmergencyBenefit>) => createBenefit(data),
    onSuccess: () => {
      toast({
        title: "Benefício criado",
        description: "O benefício foi cadastrado com sucesso.",
      });
      form.reset();
      onOpenChange(false);
      
      // Notify parent component to update benefits list
      if (onBenefitCreated) {
        onBenefitCreated();
      }
    },
    onError: (error) => {
      console.error("Error creating benefit:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cadastrar o benefício. Por favor, tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  // Form submission handler
  const onSubmit = (data: BenefitFormValues) => {
    // Get current user information to add as responsible
    // In a real application, this would come from auth context
    const userInfo = {
      responsible_id: "current-user-id", // This would come from auth
      responsible_name: "Usuário Atual", // This would come from auth
    };
    
    // Prepare benefit data
    const benefitData = {
      ...data,
      ...userInfo,
      status: "pending" as const,
      request_date: new Date().toISOString(),
    };
    
    // Submit the data
    createBenefitMutation.mutate(benefitData);
  };
  
  // Handle dialog close - reset form
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Benefício Emergencial</DialogTitle>
          <DialogDescription>
            Registre um novo benefício emergencial para um cidadão.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {/* Citizen Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Dados do Beneficiário</h4>
              
              <FormField
                control={form.control}
                name="citizen_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cidadão</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="citizen_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="000.000.000-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Benefit Information */}
            <div className="space-y-4 pt-4">
              <h4 className="text-sm font-medium">Dados do Benefício</h4>
              
              <FormField
                control={form.control}
                name="benefit_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Benefício</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo de benefício" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BENEFIT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo da Solicitação</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o motivo da solicitação" 
                        className="resize-none h-24"
                        {...field} 
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
                    <FormLabel>Observações (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observações adicionais" 
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="mr-2"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createBenefitMutation.isPending}
              >
                {createBenefitMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cadastrar Benefício
              </Button>
            </div>
            
            {createBenefitMutation.isError && (
              <div className="bg-destructive/15 p-3 rounded-md flex items-center text-sm mt-4">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span>Erro ao cadastrar benefício. Tente novamente.</span>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
