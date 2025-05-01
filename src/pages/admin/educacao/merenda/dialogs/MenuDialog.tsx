
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
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
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Checkbox,
} from "@/components/ui/checkbox";
import { getSchools } from "@/services/education/schools";
import { School, MealMenu } from "@/types/education";
import { cn } from "@/lib/utils";

// Service mock - Replace with actual implementation later
const createMenu = async (data: any) => {
  console.log("Creating menu:", data);
  return { id: "new-id", ...data };
};

const updateMenu = async (id: string, data: any) => {
  console.log("Updating menu:", id, data);
  return { id, ...data };
};

const formSchema = z.object({
  schoolId: z.string().min(1, {
    message: "É necessário selecionar uma escola.",
  }),
  menuDate: z.date({
    required_error: "É necessário selecionar uma data.",
  }),
  description: z.string().min(1, {
    message: "A descrição é obrigatória.",
  }),
});

interface MenuDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menu?: MealMenu;
  onSaved?: () => void;
}

export function MenuDialog({
  open,
  onOpenChange,
  menu,
  onSaved,
}: MenuDialogProps) {
  const { toast } = useToast();
  const [schools, setSchools] = useState<School[]>([]);
  const [isForBreakfast, setIsForBreakfast] = useState(menu?.isSpecialDiet || false);
  const [isForLunch, setIsForLunch] = useState(false);
  const [isForSnack, setIsForSnack] = useState(false);
  const [isForDinner, setIsForDinner] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: menu
      ? {
          schoolId: menu.schoolId,
          menuDate: new Date(menu.activeFrom),
          description: menu.menuItems.join(", "),
        }
      : {
          schoolId: "",
          menuDate: new Date(),
          description: "",
        },
  });

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const result = await getSchools();
        setSchools(result.data);
      } catch (error) {
        console.error("Error fetching schools:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de escolas",
          variant: "destructive",
        });
      }
    };

    fetchSchools();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const menuData = {
        ...values,
        isForBreakfast,
        isForLunch,
        isForSnack,
        isForDinner,
      };

      if (menu) {
        // Update existing menu
        await updateMenu(menu.id, menuData);
        toast({
          title: "Cardápio atualizado",
          description: "O cardápio foi atualizado com sucesso.",
        });
      } else {
        // Create new menu
        await createMenu(menuData);
        toast({
          title: "Cardápio criado",
          description: "O cardápio foi criado com sucesso.",
        });
      }

      onSaved?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating/updating menu:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o cardápio.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{menu ? "Editar Cardápio" : "Novo Cardápio"}</DialogTitle>
          <DialogDescription>
            {menu
              ? "Edite os detalhes do cardápio."
              : "Crie um novo cardápio para uma escola."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="schoolId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escola</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma escola" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
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
              name="menuDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data do Cardápio</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span>Selecione a data</span>
                          )}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        locale={ptBR}
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date()
                        }
                        initialFocus
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Arroz, feijão, carne..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <Label>Aplicação:</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isForBreakfast" 
                    checked={isForBreakfast}
                    onCheckedChange={(checked) => setIsForBreakfast(checked === true)}
                  />
                  <label htmlFor="isForBreakfast">Café da Manhã</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isForLunch" 
                    checked={isForLunch}
                    onCheckedChange={(checked) => setIsForLunch(checked === true)}
                  />
                  <label htmlFor="isForLunch">Almoço</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isForSnack" 
                    checked={isForSnack}
                    onCheckedChange={(checked) => setIsForSnack(checked === true)}
                  />
                  <label htmlFor="isForSnack">Lanche</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isForDinner" 
                    checked={isForDinner}
                    onCheckedChange={(checked) => setIsForDinner(checked === true)}
                  />
                  <label htmlFor="isForDinner">Jantar</label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit">Salvar Cardápio</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
