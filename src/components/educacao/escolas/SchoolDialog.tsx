
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createSchool, updateSchool } from "@/services/education/schools";
import { School, SchoolType } from "@/types/education";

const schoolFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  inepCode: z.string().min(3, "O código INEP deve ter no mínimo 3 caracteres"),
  type: z.enum(["school", "cmei", "eja"]),
  address: z.string().min(5, "O endereço deve ter no mínimo 5 caracteres"),
  neighborhood: z.string().min(2, "O bairro deve ter no mínimo 2 caracteres"),
  city: z.string().min(2, "A cidade deve ter no mínimo 2 caracteres"),
  state: z.string().min(2, "O estado deve ter no mínimo 2 caracteres"),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  directorName: z.string().optional(),
  directorContact: z.string().optional(),
  viceDirectorName: z.string().optional(),
  viceDirectorContact: z.string().optional(),
  pedagogicalCoordinator: z.string().optional(),
  maxCapacity: z.number().min(1, "A capacidade deve ser maior que zero"),
  shifts: z.array(z.string()).min(1, "Selecione pelo menos um turno"),
  isActive: z.boolean().default(true),
});

type SchoolFormValues = z.infer<typeof schoolFormSchema>;

interface SchoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  school: School | null;
  onCreated: () => void;
  onUpdated: () => void;
}

export default function SchoolDialog({
  open,
  onOpenChange,
  school,
  onCreated,
  onUpdated,
}: SchoolDialogProps) {
  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: "",
      inepCode: "",
      type: "school",
      address: "",
      neighborhood: "",
      city: "Cidade",
      state: "Estado",
      zipCode: "",
      phone: "",
      email: "",
      directorName: "",
      directorContact: "",
      viceDirectorName: "",
      viceDirectorContact: "",
      pedagogicalCoordinator: "",
      maxCapacity: 100,
      shifts: ["morning"],
      isActive: true,
    },
  });

  // Set form values when editing an existing school
  React.useEffect(() => {
    if (school) {
      form.reset({
        name: school.name,
        inepCode: school.inepCode,
        type: school.type,
        address: school.address,
        neighborhood: school.neighborhood,
        city: school.city,
        state: school.state,
        zipCode: school.zipCode || "",
        phone: school.phone || "",
        email: school.email || "",
        directorName: school.directorName || "",
        directorContact: school.directorContact || "",
        viceDirectorName: school.viceDirectorName || "",
        viceDirectorContact: school.viceDirectorContact || "",
        pedagogicalCoordinator: school.pedagogicalCoordinator || "",
        maxCapacity: school.maxCapacity,
        shifts: school.shifts,
        isActive: school.isActive,
      });
    } else {
      form.reset({
        name: "",
        inepCode: "",
        type: "school",
        address: "",
        neighborhood: "",
        city: "Cidade",
        state: "Estado",
        zipCode: "",
        phone: "",
        email: "",
        directorName: "",
        directorContact: "",
        viceDirectorName: "",
        viceDirectorContact: "",
        pedagogicalCoordinator: "",
        maxCapacity: 100,
        shifts: ["morning"],
        isActive: true,
      });
    }
  }, [school, open]);

  const handleShiftToggle = (shift: string) => {
    const currentShifts = form.getValues("shifts") || [];
    if (currentShifts.includes(shift)) {
      form.setValue(
        "shifts",
        currentShifts.filter((s) => s !== shift)
      );
    } else {
      form.setValue("shifts", [...currentShifts, shift]);
    }
  };

  const isShiftSelected = (shift: string) => {
    return form.getValues("shifts")?.includes(shift) || false;
  };

  const onSubmit = async (values: SchoolFormValues) => {
    try {
      if (school) {
        // Update existing school
        await updateSchool(school.id, values);
        onUpdated();
      } else {
        // Create new school
        await createSchool(values);
        onCreated();
      }
    } catch (error) {
      console.error("Error saving school:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{school ? "Editar Escola" : "Nova Escola"}</DialogTitle>
          <DialogDescription>
            {school
              ? "Atualize as informações da escola"
              : "Preencha as informações para criar uma nova escola"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Escola</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo da instituição" {...field} />
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
                      <FormLabel>Código INEP</FormLabel>
                      <FormControl>
                        <Input placeholder="Código do INEP" {...field} />
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
                      <FormLabel>Tipo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
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
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua e número" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input placeholder="Bairro" {...field} />
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
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
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="Estado" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="Telefone da instituição" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email da instituição" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="maxCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacidade Máxima</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Número máximo de alunos"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Número total de estudantes que a instituição pode atender
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Status</FormLabel>
                        <FormDescription>
                          Indica se a escola está ativa ou inativa
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Turnos Oferecidos</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="morning"
                    checked={isShiftSelected("morning")}
                    onCheckedChange={() => handleShiftToggle("morning")}
                  />
                  <label htmlFor="morning" className="text-sm">
                    Manhã
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="afternoon"
                    checked={isShiftSelected("afternoon")}
                    onCheckedChange={() => handleShiftToggle("afternoon")}
                  />
                  <label htmlFor="afternoon" className="text-sm">
                    Tarde
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="evening"
                    checked={isShiftSelected("evening")}
                    onCheckedChange={() => handleShiftToggle("evening")}
                  />
                  <label htmlFor="evening" className="text-sm">
                    Noite
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="full"
                    checked={isShiftSelected("full")}
                    onCheckedChange={() => handleShiftToggle("full")}
                  />
                  <label htmlFor="full" className="text-sm">
                    Integral
                  </label>
                </div>
              </div>
              {form.formState.errors.shifts && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {form.formState.errors.shifts.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Equipe Gestora</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="directorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Diretor(a)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
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
                        <Input placeholder="Telefone ou email" {...field} />
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
                      <FormLabel>Nome do Vice-Diretor(a)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
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
                        <Input placeholder="Telefone ou email" {...field} />
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
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {school ? "Salvar Alterações" : "Criar Escola"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
