
import React from "react";
import { useNavigate } from "react-router-dom";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createCitizenRequest, NewRequestData } from "@/services/citizen/requestsService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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

const formSchema = z.object({
  title: z.string().min(5, "Título deve ter pelo menos 5 caracteres"),
  description: z.string().min(20, "Descrição deve ter pelo menos 20 caracteres"),
  target_department: z.string().min(1, "Departamento é obrigatório"),
  priority: z.string().min(1, "Prioridade é obrigatória"),
});

const departments = [
  { value: "Gabinete do Prefeito", label: "Gabinete do Prefeito" },
  { value: "Secretaria de Administração", label: "Secretaria de Administração" },
  { value: "Secretaria de Educação", label: "Secretaria de Educação" },
  { value: "Secretaria de Saúde", label: "Secretaria de Saúde" },
  { value: "Secretaria de Assistência Social", label: "Secretaria de Assistência Social" },
  { value: "Secretaria de Infraestrutura", label: "Secretaria de Infraestrutura" },
  { value: "Secretaria de Finanças", label: "Secretaria de Finanças" },
  { value: "Secretaria de Meio Ambiente", label: "Secretaria de Meio Ambiente" },
];

export default function NewCitizenRequestPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      target_department: "",
      priority: "normal",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const requestData: NewRequestData = {
        title: values.title,
        description: values.description,
        target_department: values.target_department,
        priority: values.priority,
      };
      
      const result = await createCitizenRequest(requestData, user?.id);
      if (result) {
        navigate(`/citizen/requests/${result.id}`);
      }
    } catch (error) {
      console.error("Error creating request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/citizen/requests")}
          className="mr-2"
        >
          <ChevronLeft size={20} />
        </Button>
        <Heading 
          title="Nova Solicitação" 
          description="Preencha os dados abaixo para registrar uma nova solicitação"
        />
      </div>
      
      <Separator />

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Dados da Solicitação</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título da Solicitação</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Manutenção de iluminação pública" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Um título breve e descritivo para sua solicitação
                    </FormDescription>
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
                        placeholder="Descreva detalhadamente sua solicitação..." 
                        className="min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Forneça todos os detalhes que puder para que possamos atender sua solicitação adequadamente
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="target_department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departamento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um departamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.value} value={dept.value}>
                              {dept.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Selecione o departamento responsável
                      </FormDescription>
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
                      <FormDescription>
                        Indique a urgência da sua solicitação
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/citizen/requests")}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Enviando...
                  </>
                ) : (
                  "Enviar Solicitação"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
