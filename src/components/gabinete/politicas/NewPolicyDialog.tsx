
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, Plus, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Form schema
const policyFormSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  department: z.string().min(1, "O departamento é obrigatório"),
  responsibleId: z.string().min(1, "O responsável é obrigatório"),
  startDate: z.date({
    required_error: "A data de início é obrigatória",
  }),
  endDate: z.date().optional(),
  status: z.enum(["draft", "active", "completed", "cancelled"]),
  goals: z.array(z.object({
    title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
    description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
    targetValue: z.number().optional(),
    targetUnit: z.string().optional(),
    dueDate: z.date().optional(),
    status: z.enum(["pending", "in_progress", "completed", "cancelled"]).default("pending"),
  })).default([]),
});

type FormValues = z.infer<typeof policyFormSchema>;

const departments = [
  "Gabinete do Prefeito",
  "Administração",
  "Finanças",
  "Obras",
  "Saúde",
  "Educação",
  "Assistência Social",
  "Meio Ambiente",
  "Serviços Urbanos",
];

const responsibles = [
  { id: "resp-1", name: "João Silva" },
  { id: "resp-2", name: "Maria Oliveira" },
  { id: "resp-3", name: "Pedro Santos" },
];

export function NewPolicyDialog() {
  const [open, setOpen] = React.useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      department: "",
      responsibleId: "",
      status: "draft",
      goals: [],
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);
    // Here you would submit the data to your API
    
    // Simulate API call with timeout
    setTimeout(() => {
      setOpen(false);
      form.reset();
    }, 1000);
  }

  const addGoal = () => {
    const goals = form.getValues("goals") || [];
    form.setValue("goals", [
      ...goals, 
      {
        title: "",
        description: "",
        status: "pending"
      }
    ]);
  };

  const removeGoal = (index: number) => {
    const goals = form.getValues("goals");
    form.setValue(
      "goals",
      goals.filter((_, i) => i !== index)
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nova Política
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Política Pública</DialogTitle>
          <DialogDescription>
            Crie uma nova política pública com objetivos e metas mensuráveis.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título da política pública" {...field} />
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
                        placeholder="Descreva os objetivos e finalidades da política"
                        className="min-h-[100px]"
                        {...field}
                      />
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                  name="responsibleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsável</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um responsável" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {responsibles.map((resp) => (
                            <SelectItem key={resp.id} value={resp.id}>
                              {resp.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Início</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
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
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Término (opcional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
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
                            disabled={(date) => {
                              const start = form.getValues("startDate");
                              return start ? date < start : false;
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                      <FormDescription>
                        Defina quando a política deve terminar (opcional)
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="active">Ativa</SelectItem>
                          <SelectItem value="completed">Concluída</SelectItem>
                          <SelectItem value="cancelled">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Metas</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addGoal}
                >
                  <PlusCircle className="mr-1 h-4 w-4" />
                  Adicionar Meta
                </Button>
              </div>

              {form.watch("goals")?.length === 0 && (
                <div className="text-center p-4 border border-dashed rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Nenhuma meta definida. Clique em "Adicionar Meta" para criar metas para esta política.
                  </p>
                </div>
              )}

              {form.watch("goals")?.map((_, index) => (
                <div
                  key={index}
                  className="border rounded-md p-4 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Meta {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGoal(index)}
                      className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      Remover
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name={`goals.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título da Meta</FormLabel>
                        <FormControl>
                          <Input placeholder="Título da meta" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`goals.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva esta meta"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`goals.${index}.targetValue`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Alvo (opcional)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Valor numérico alvo"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`goals.${index}.targetUnit`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unidade (opcional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: pessoas, %"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`goals.${index}.dueDate`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data Limite (opcional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
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
                                disabled={(date) => {
                                  const start = form.getValues("startDate");
                                  return start ? date < start : false;
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`goals.${index}.status`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Status da meta" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="in_progress">Em Progresso</SelectItem>
                              <SelectItem value="completed">Concluída</SelectItem>
                              <SelectItem value="cancelled">Cancelada</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Criar Política"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
