
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createTransportRequest, updateTransportRequest } from "@/services/education/transport";
import { TransportRequest, TransportRequestType, TransportRequestStatus } from "@/types/education";
import { toast } from "@/hooks/use-toast";

// Define the schema for the form
const requestFormSchema = z.object({
  requestType: z.enum(["new", "change", "complaint", "cancellation"], {
    required_error: "Tipo de solicitação é obrigatório",
  }),
  requesterName: z.string().min(1, "Nome do solicitante é obrigatório"),
  requesterContact: z.string().min(1, "Contato do solicitante é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  studentId: z.string().optional(),
  schoolId: z.string().optional(),
  currentRouteId: z.string().optional(),
  requestedRouteId: z.string().optional(),
  pickupLocation: z.string().optional(),
  returnLocation: z.string().optional(),
  complaintType: z.string().optional(),
  status: z.enum(["pending", "in_analysis", "approved", "rejected", "resolved"]),
  resolutionNotes: z.string().optional(),
});

type RequestFormValues = z.infer<typeof requestFormSchema>;

interface RequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request?: TransportRequest | null;
  onCreated: () => void;
  onUpdated: () => void;
}

export default function RequestDialog({
  open,
  onOpenChange,
  request,
  onCreated,
  onUpdated,
}: RequestDialogProps) {
  const isEditing = !!request;
  const title = isEditing ? "Detalhes da Solicitação" : "Nova Solicitação de Transporte";
  
  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      requestType: request?.requestType || "new",
      requesterName: request?.requesterName || "",
      requesterContact: request?.requesterContact || "",
      description: request?.description || "",
      studentId: request?.studentId || "",
      schoolId: request?.schoolId || "",
      currentRouteId: request?.currentRouteId || "",
      requestedRouteId: request?.requestedRouteId || "",
      pickupLocation: request?.pickupLocation || "",
      returnLocation: request?.returnLocation || "",
      complaintType: request?.complaintType || "",
      status: request?.status || "pending",
      resolutionNotes: request?.resolutionNotes || "",
    },
  });

  // Watch for the request type to conditionally show fields
  const requestType = form.watch("requestType");

  const onSubmit = async (values: RequestFormValues) => {
    try {
      if (isEditing && request) {
        await updateTransportRequest(request.id, values);
        toast({
          title: "Sucesso",
          description: "Solicitação atualizada com sucesso",
        });
        onUpdated();
      } else {
        await createTransportRequest(values);
        toast({
          title: "Sucesso", 
          description: "Solicitação criada com sucesso"
        });
        onCreated();
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar solicitação:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar solicitação",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {isEditing && request && (
            <DialogDescription>
              Protocolo: {request.protocolNumber} • Data: {new Date(request.createdAt).toLocaleDateString()}
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="requestType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Solicitação*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">Nova Solicitação</SelectItem>
                        <SelectItem value="change">Alteração</SelectItem>
                        <SelectItem value="complaint">Reclamação</SelectItem>
                        <SelectItem value="cancellation">Cancelamento</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="in_analysis">Em Análise</SelectItem>
                        <SelectItem value="approved">Aprovada</SelectItem>
                        <SelectItem value="rejected">Rejeitada</SelectItem>
                        <SelectItem value="resolved">Resolvida</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="requesterName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Solicitante*</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="requesterContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contato do Solicitante*</FormLabel>
                    <FormControl>
                      <Input placeholder="Telefone ou email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID do Aluno</FormLabel>
                    <FormControl>
                      <Input placeholder="ID do aluno" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="schoolId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID da Escola</FormLabel>
                    <FormControl>
                      <Input placeholder="ID da escola" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {(requestType === "change" || requestType === "cancellation") && (
                <FormField
                  control={form.control}
                  name="currentRouteId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rota Atual</FormLabel>
                      <FormControl>
                        <Input placeholder="ID da rota atual" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {requestType === "new" || requestType === "change" ? (
                <>
                  <FormField
                    control={form.control}
                    name="requestedRouteId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rota Solicitada</FormLabel>
                        <FormControl>
                          <Input placeholder="ID da rota solicitada" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pickupLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local de Embarque</FormLabel>
                        <FormControl>
                          <Input placeholder="Endereço de embarque" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="returnLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local de Desembarque</FormLabel>
                        <FormControl>
                          <Input placeholder="Endereço de desembarque" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : null}
              
              {requestType === "complaint" && (
                <FormField
                  control={form.control}
                  name="complaintType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo da Reclamação</FormLabel>
                      <FormControl>
                        <Input placeholder="Tipo da reclamação" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva a solicitação em detalhes"
                      className="resize-none min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {(form.watch("status") === "resolved" || form.watch("status") === "rejected" || form.watch("status") === "approved") && (
              <FormField
                control={form.control}
                name="resolutionNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas de Resolução</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva como a solicitação foi resolvida"
                        className="resize-none min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Salvar alterações" : "Criar Solicitação"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
