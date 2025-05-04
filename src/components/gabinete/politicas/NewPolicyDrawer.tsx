import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Policy, PolicyStatus } from "@/types/mayorOffice";
import { useAuth } from "@/contexts/AuthContext";

// Form schema
const policyFormSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
  department: z.string().min(1, { message: "O departamento responsável é obrigatório" }),
  category: z.string().min(1, { message: "A categoria é obrigatória" }),
  status: z.enum(["draft", "review", "approved", "active", "inactive"]).default("draft"),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
});

type PolicyFormValues = z.infer<typeof policyFormSchema>;

// Mock function to create a policy (replace with real API call)
const createPolicy = async (data: PolicyFormValues): Promise<Policy> => {
  // This would be replaced with an actual API call
  const currentDate = new Date().toISOString(); // Convert Date to string
  
  return {
    id: Math.random().toString(36).substring(7),
    name: data.name,
    description: data.description,
    category: data.category,
    status: "draft", // Make sure this is a valid PolicyStatus
    updatedAt: currentDate, // Use string instead of Date object
    key_objectives: [],
  };
};

interface NewPolicyDrawerProps {
  onSuccess?: () => void;
}

export function NewPolicyDrawer({ onSuccess }: NewPolicyDrawerProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  
  const departments = [
    "Gabinete do Prefeito",
    "Administração",
    "Saúde",
    "Educação",
    "Assistência Social",
    "Obras",
    "Finanças",
    "Meio Ambiente",
    "Cultura",
  ];

  const categories = [
    "Saúde Pública",
    "Educação",
    "Infraestrutura",
    "Desenvolvimento Econômico",
    "Meio Ambiente",
    "Assistência Social",
    "Segurança Pública",
    "Cultura",
    "Esporte e Lazer",
    "Habitação",
    "Transporte",
    "Turismo",
  ];

  // Setup form with default values
  const form = useForm<PolicyFormValues>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: {
      name: "",
      description: "",
      priority: "normal",
      status: "draft",
    },
  });

  // Create policy mutation
  const createPolicyMutation = useMutation({
    mutationFn: createPolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publicPolicies"] });
      toast({
        title: "Política pública criada",
        description: "A política pública foi criada com sucesso",
      });
      setOpen(false);
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar política pública",
        description: error.message || "Ocorreu um erro ao criar a política pública",
        variant: "destructive",
      });
    },
  });

  // Form submission
  const onSubmit = (data: PolicyFormValues) => {
    createPolicyMutation.mutate(data);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nova Política Pública
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90%] sm:max-w-[600px] overflow-y-auto max-h-[85vh]">
        <SheetHeader>
          <SheetTitle>Nova Política Pública</SheetTitle>
          <SheetDescription>
            Preencha os campos para criar uma nova política pública.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Política</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da política pública" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departamento Responsável</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um departamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="review">Em revisão</SelectItem>
                          <SelectItem value="approved">Aprovada</SelectItem>
                          <SelectItem value="active">Ativa</SelectItem>
                          <SelectItem value="inactive">Inativa</SelectItem>
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva a política pública" 
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
                  disabled={createPolicyMutation.isPending}
                  className="w-full"
                >
                  {createPolicyMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    "Criar Política Pública"
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
