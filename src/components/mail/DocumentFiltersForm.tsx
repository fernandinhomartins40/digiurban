
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMail } from "@/hooks/use-mail";
import { DocumentFilters } from "@/types/mail";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  type: z.string().optional(),
  department: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
});

interface DocumentFiltersFormProps {
  onFilter: (filters: DocumentFilters) => void;
}

export function DocumentFiltersForm({ onFilter }: DocumentFiltersFormProps) {
  const { documentTypes } = useMail();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      department: "",
      status: "",
      search: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const filters: DocumentFilters = {};
    
    if (values.type) filters.type = values.type;
    if (values.department) filters.department = values.department;
    if (values.status) filters.status = values.status as any;
    if (values.search) filters.search = values.search;
    
    onFilter(filters);
  }

  function handleReset() {
    form.reset();
    onFilter({});
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Documento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os tipos" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Todos os tipos</SelectItem>
                        {documentTypes.data?.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o departamento"
                        {...field}
                      />
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Todos os status</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="forwarded">Encaminhado</SelectItem>
                        <SelectItem value="responded">Respondido</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buscar</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Buscar por título ou protocolo"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
              >
                Limpar Filtros
              </Button>
              <Button type="submit">Filtrar</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
