
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  SocialProgram,
  ProgramBeneficiary,
} from "@/types/assistance";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  getProgramBeneficiaries,
  createProgramBeneficiary,
} from "@/services/assistance";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, UserPlus, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  citizen_id: z.string().min(1, "ID do cidadão é obrigatório"),
  nis_number: z.string().optional(),
  entry_date: z.date().default(() => new Date()),
});

interface BeneficiariesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  program: SocialProgram | null;
}

export default function BeneficiariesDialog({
  isOpen,
  onClose,
  program,
}: BeneficiariesDialogProps) {
  const { toast } = useToast();
  const [beneficiaries, setBeneficiaries] = useState<ProgramBeneficiary[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("list");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      citizen_id: "",
      nis_number: "",
      entry_date: new Date(),
    },
  });

  useEffect(() => {
    if (program?.id && isOpen) {
      fetchBeneficiaries();
    }
  }, [program?.id, isOpen]);

  const fetchBeneficiaries = async () => {
    if (!program?.id) return;
    
    setLoading(true);
    try {
      const data = await getProgramBeneficiaries(program.id);
      setBeneficiaries(data);
    } catch (error) {
      console.error("Error fetching beneficiaries:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os beneficiários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!program?.id) return;

    try {
      const beneficiaryData = {
        citizen_id: values.citizen_id,
        program_id: program.id,
        nis_number: values.nis_number || undefined,
        entry_date: format(values.entry_date, "yyyy-MM-dd"),
        is_active: true,
      };

      await createProgramBeneficiary(beneficiaryData);
      
      toast({
        title: "Sucesso",
        description: "Beneficiário adicionado com sucesso",
      });
      
      form.reset({
        citizen_id: "",
        nis_number: "",
        entry_date: new Date(),
      });
      
      setActiveTab("list");
      await fetchBeneficiaries();
    } catch (error) {
      console.error("Erro ao adicionar beneficiário:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o beneficiário",
        variant: "destructive",
      });
    }
  };

  if (!program) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Beneficiários do Programa</DialogTitle>
          <DialogDescription>
            {program.name} - Gerenciar beneficiários
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="list"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Lista de Beneficiários</TabsTrigger>
            <TabsTrigger value="add">Adicionar Beneficiário</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-4">
            <div className="h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID do Cidadão</TableHead>
                    <TableHead>NIS</TableHead>
                    <TableHead>Data de Entrada</TableHead>
                    <TableHead>Data de Saída</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        Carregando beneficiários...
                      </TableCell>
                    </TableRow>
                  ) : beneficiaries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                        Nenhum beneficiário cadastrado neste programa.
                      </TableCell>
                    </TableRow>
                  ) : (
                    beneficiaries.map((beneficiary) => (
                      <TableRow key={beneficiary.id}>
                        <TableCell>{beneficiary.citizen_id}</TableCell>
                        <TableCell>
                          {beneficiary.nis_number || "-"}
                        </TableCell>
                        <TableCell>
                          {format(new Date(beneficiary.entry_date), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>
                          {beneficiary.exit_date
                            ? format(new Date(beneficiary.exit_date), "dd/MM/yyyy")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              beneficiary.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {beneficiary.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setActiveTab("add")}
                className="flex items-center"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Beneficiário
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="add" className="mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="citizen_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID do Cidadão</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ID do cidadão beneficiário" />
                      </FormControl>
                      <FormDescription>
                        Informe o ID do cidadão registrado no sistema
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nis_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número NIS (opcional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Número NIS do beneficiário" />
                      </FormControl>
                      <FormDescription>
                        Informe o Número de Identificação Social, se disponível
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="entry_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Entrada</FormLabel>
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
                                format(field.value, "dd/MM/yyyy")
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

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("list")}
                    className="flex items-center"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  
                  <Button type="submit" className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Adicionar Beneficiário
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
