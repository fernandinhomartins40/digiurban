
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HRAttendanceCreate, HRAttendance, HRAttendanceStatus } from "@/types/hr";
import { useAuth } from "@/contexts/auth/useAuth";
import { fetchServices } from "@/services/administration/hr";
import { HRService } from "@/types/hr";
import { useApiQuery } from "@/lib/hooks/useApiQuery";

interface AttendanceFormProps {
  initialData?: HRAttendance;
  onSubmit: (data: HRAttendanceCreate) => void;
  employees: { id: string; name: string }[];
  isLoading: boolean;
}

export const AttendanceForm = ({
  initialData,
  onSubmit,
  employees,
  isLoading,
}: AttendanceFormProps) => {
  const { user } = useAuth();
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(
    initialData?.employeeId || null
  );

  // Fetch HR services
  const { data: services = [], isLoading: isLoadingServices } = useApiQuery(
    ['hr-services'],
    async () => {
      const response = await fetchServices();
      return response.data || [];
    },
    {
      enabled: true,
    }
  );

  const form = useForm<HRAttendanceCreate>({
    defaultValues: initialData
      ? {
          employeeId: initialData.employeeId,
          serviceId: initialData.serviceId || "",
          description: initialData.description,
          status: initialData.status,
          attendanceDate: initialData.attendanceDate,
          attendedBy: initialData.attendedBy,
          notes: initialData.notes || "",
        }
      : {
          employeeId: "",
          serviceId: "",
          description: "",
          status: "in_progress",
          attendanceDate: new Date(),
          attendedBy: user?.id || "",
          notes: "",
        },
  });

  useEffect(() => {
    if (initialData) {
      setSelectedEmployee(initialData.employeeId);
    }
  }, [initialData]);

  const handleSubmit = (data: HRAttendanceCreate) => {
    onSubmit(data);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {initialData ? "Editar Atendimento" : "Novo Atendimento"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? "Editar Atendimento" : "Novo Atendimento"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servidor</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedEmployee(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um servidor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
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
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviço</FormLabel>
                  <Select
                    disabled={isLoadingServices}
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map((service: HRService) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Descreva o atendimento"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="in_progress">Em andamento</SelectItem>
                      <SelectItem value="concluded">Concluído</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações adicionais"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {initialData ? "Atualizar" : "Cadastrar"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AttendanceForm;
