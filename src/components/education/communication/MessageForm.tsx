
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParentMessage, fetchMessageRecipients } from "@/services/education/communication";
import { useToast } from "@/components/ui/use-toast";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const messageFormSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  content: z.string().min(10, "Conteúdo deve ter pelo menos 10 caracteres"),
  message_type: z.enum(["announcement", "notice", "reminder", "report", "meeting"]),
  recipient_type: z.enum(["parent", "teacher", "school", "class"]),
  recipient_ids: z.array(z.string()).min(1, "Selecione pelo menos um destinatário"),
  is_important: z.boolean().default(false),
  status: z.enum(["draft", "sent", "scheduled"]),
  scheduled_for: z.date().optional(),
});

type MessageFormValues = z.infer<typeof messageFormSchema>;

interface MessageFormProps {
  onSubmit: (data: Omit<ParentMessage, 'id' | 'created_at' | 'updated_at' | 'read_by'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ParentMessage>;
}

export function MessageForm({ onSubmit, onCancel, initialData }: MessageFormProps) {
  const { toast } = useToast();
  const [recipients, setRecipients] = useState<{ id: string; name: string; type: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: Partial<MessageFormValues> = {
    title: initialData?.title || "",
    content: initialData?.content || "",
    message_type: initialData?.message_type || "announcement",
    recipient_type: initialData?.recipient_type || "parent",
    recipient_ids: initialData?.recipient_ids || [],
    is_important: initialData?.is_important || false,
    status: initialData?.status || "sent",
    scheduled_for: initialData?.scheduled_for ? new Date(initialData.scheduled_for) : undefined,
  };

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues,
  });

  const watchRecipientType = form.watch("recipient_type");
  const watchStatus = form.watch("status");

  React.useEffect(() => {
    const loadRecipients = async () => {
      try {
        const data = await fetchMessageRecipients(watchRecipientType as any);
        setRecipients(data);
      } catch (error) {
        console.error("Error loading recipients:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os destinatários",
          variant: "destructive",
        });
      }
    };

    loadRecipients();
  }, [watchRecipientType, toast]);

  async function onFormSubmit(values: MessageFormValues) {
    setIsLoading(true);
    try {
      // Prepare submission data and convert Date to string for scheduled_for
      const messageData = {
        ...values,
        sender_id: "current-user-id", // Would be replaced with actual user ID
        sender_name: "Usuário Atual", // Would be replaced with actual user name
        // Convert the Date object to ISO string if it exists
        scheduled_for: values.scheduled_for ? values.scheduled_for.toISOString() : undefined,
      } as Omit<ParentMessage, 'id' | 'created_at' | 'updated_at' | 'read_by'>;

      await onSubmit(messageData);
      toast({
        title: "Sucesso",
        description: "Mensagem enviada com sucesso",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar a mensagem",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Digite o título da mensagem" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo</FormLabel>
              <FormControl>
                <Textarea placeholder="Digite o conteúdo da mensagem" className="min-h-[150px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="message_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de mensagem</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tipo de mensagem" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="announcement">Comunicado</SelectItem>
                    <SelectItem value="notice">Aviso</SelectItem>
                    <SelectItem value="reminder">Lembrete</SelectItem>
                    <SelectItem value="report">Relatório</SelectItem>
                    <SelectItem value="meeting">Reunião</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recipient_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de destinatário</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tipo de destinatário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="parent">Pais</SelectItem>
                    <SelectItem value="teacher">Professores</SelectItem>
                    <SelectItem value="class">Turma</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="recipient_ids"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Destinatários</FormLabel>
                <FormDescription>
                  Selecione os destinatários para a mensagem
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipients.map((recipient) => (
                  <FormField
                    key={recipient.id}
                    control={form.control}
                    name="recipient_ids"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={recipient.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(recipient.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, recipient.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== recipient.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {recipient.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_important"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Marcar como importante</FormLabel>
                <FormDescription>
                  As mensagens importantes são destacadas para os destinatários
                </FormDescription>
              </div>
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
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sent">Enviar agora</SelectItem>
                  <SelectItem value="scheduled">Agendar envio</SelectItem>
                  <SelectItem value="draft">Salvar como rascunho</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchStatus === "scheduled" && (
          <FormField
            control={form.control}
            name="scheduled_for"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de envio</FormLabel>
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
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
