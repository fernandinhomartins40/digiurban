
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createSchool,
  updateSchool,
} from "@/services/education/schools";
import { School } from "@/types/education";
import { toast } from "sonner";

// Define the schema for the form
const schoolFormSchema = z.object({
  name: z.string().min(1, "Nome da escola é obrigatório"),
  inepCode: z.string().min(1, "Código INEP é obrigatório"),
  type: z.enum(["school", "cmei", "eja"]),
  address: z.string().min(1, "Endereço é obrigatório"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  directorName: z.string().optional(),
  directorContact: z.string().optional(),
  viceDirectorName: z.string().optional(),
  viceDirectorContact: z.string().optional(),
  pedagogicalCoordinator: z.string().optional(),
  maxCapacity: z.coerce.number().min(1, "Capacidade máxima deve ser maior que zero"),
  currentStudents: z.coerce.number().default(0),
  shifts: z.array(z.string()).min(1, "Selecione pelo menos um turno"),
  isActive: z.boolean().default(true),
});

type SchoolFormValues = z.infer<typeof schoolFormSchema>;

interface SchoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  school?: School | null;
  onCreated: () => void;
  onUpdated: () => void;
}

export function SchoolDialog({
  open,
  onOpenChange,
  school,
  onCreated,
  onUpdated,
}: SchoolDialogProps) {
  const isEditing = !!school;
  const title = isEditing ? "Editar Escola" : "Nova Escola";

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: school?.name || "",
      inepCode: school?.inepCode || "",
      type: school?.type || "school",
      address: school?.address || "",
      neighborhood: school?.neighborhood || "",
      city: school?.city || "Cidade",
      state: school?.state || "Estado",
      zipCode: school?.zipCode || "",
      phone: school?.phone || "",
      email: school?.email || "",
      directorName: school?.directorName || "",
      directorContact: school?.directorContact || "",
      viceDirectorName: school?.viceDirectorName || "",
      viceDirectorContact: school?.viceDirectorContact || "",
      pedagogicalCoordinator: school?.pedagogicalCoordinator || "",
      maxCapacity: school?.maxCapacity || 0,
      currentStudents: school?.currentStudents || 0,
      shifts: school?.shifts || [],
      isActive: school?.isActive ?? true,
    },
  });

  const onSubmit = async (values: SchoolFormValues) => {
    try {
      if (isEditing && school) {
        await updateSchool(school.id, values);
        toast.success("Escola atualizada com sucesso");
        onUpdated();
      } else {
        await createSchool(values as Omit<School, "id" | "createdAt" | "updatedAt">);
        toast.success("Escola cadastrada com sucesso");
        onCreated();
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar escola:", error);
      toast.error("Erro ao salvar escola");
    }
  };

  const shifts = [
    { value: "morning", label: "Manhã" },
    { value: "afternoon", label: "Tarde" },
    { value: "evening", label: "Noite" },
    { value: "full", label: "Integral" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Escola*</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da escola" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inepCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código INEP*</FormLabel>
                    <FormControl>
                      <Input placeholder="Código INEP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="school">Escola</SelectItem>
                        <SelectItem value="cmei">CMEI</SelectItem>
                        <SelectItem value="eja">EJA</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="E-mail" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço*</FormLabel>
                    <FormControl>
                      <Input placeholder="Endereço" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro*</FormLabel>
                    <FormControl>
                      <Input placeholder="Bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade*</FormLabel>
                    <FormControl>
                      <Input placeholder="Cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado*</FormLabel>
                    <FormControl>
                      <Input placeholder="Estado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input placeholder="CEP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="Telefone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidade Máxima*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Capacidade de alunos"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentStudents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alunos Atuais</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Número atual de alunos"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="directorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diretor(a)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do Diretor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="directorContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contato do Diretor(a)</FormLabel>
                    <FormControl>
                      <Input placeholder="Contato" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="viceDirectorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vice-Diretor(a)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do Vice-Diretor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="viceDirectorContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contato do Vice-Diretor(a)</FormLabel>
                    <FormControl>
                      <Input placeholder="Contato" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pedagogicalCoordinator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coordenador(a) Pedagógico</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do Coordenador" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>Turnos*</FormLabel>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {shifts.map((shift) => (
                    <FormField
                      key={shift.value}
                      control={form.control}
                      name="shifts"
                      render={({ field }) => (
                        <FormItem
                          key={shift.value}
                          className="flex flex-row items-center space-x-2 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(shift.value)}
                              onCheckedChange={(checked) => {
                                const updatedShifts = checked
                                  ? [...field.value, shift.value]
                                  : field.value.filter((val) => val !== shift.value);
                                field.onChange(updatedShifts);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {shift.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                {form.formState.errors.shifts && (
                  <p className="text-sm font-medium text-destructive mt-1">
                    {form.formState.errors.shifts.message}
                  </p>
                )}
              </div>
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md pt-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Ativo</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Salvar alterações" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Also export as default for compatibility with existing imports
export default SchoolDialog;
