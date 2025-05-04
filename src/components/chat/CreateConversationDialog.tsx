
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChat } from "@/contexts/ChatContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";

// Mock departments and protocols
const DEPARTMENTS = [
  { id: "health", name: "Secretaria de Saúde" },
  { id: "education", name: "Secretaria de Educação" },
  { id: "finance", name: "Secretaria de Finanças" },
  { id: "planning", name: "Secretaria de Planejamento" },
  { id: "admin", name: "Administração" },
];

const PROTOCOLS = [
  { id: "2025-000123", title: "Solicitação de material escolar" },
  { id: "2025-000124", title: "Consulta de agendamento médico" },
  { id: "2025-000125", title: "Análise de projeto urbano" },
];

const formSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  departmentId: z.string().min(1, "Selecione um departamento"),
  protocolId: z.string().optional(),
});

interface CreateConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateConversationDialog({
  open,
  onOpenChange,
}: CreateConversationDialogProps) {
  const { createConversation, setActiveConversation } = useChat();
  const [isLinkingProtocol, setIsLinkingProtocol] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      departmentId: "",
      protocolId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Get department name for the title if not provided
      let title = values.title;
      if (!title) {
        const department = DEPARTMENTS.find(d => d.id === values.departmentId);
        title = department ? `Conversa com ${department.name}` : "Nova conversa";
      }

      // Create the conversation
      const conversationId = await createConversation(
        "internal",
        values.departmentId,
        title,
        values.protocolId ? [values.protocolId] : undefined
      );

      // Set it as the active conversation
      setActiveConversation(conversationId);
      
      // Close the dialog
      onOpenChange(false);
      form.reset();
      
      toast({
        title: "Conversa criada",
        description: "A nova conversa foi criada com sucesso.",
      });
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a conversa. Tente novamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova conversa interna</DialogTitle>
          <DialogDescription>
            Crie uma nova conversa com outro departamento ou servidor.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da conversa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Solicitação de suporte técnico" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um departamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="linkProtocol"
                checked={isLinkingProtocol}
                onChange={(e) => setIsLinkingProtocol(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="linkProtocol" className="text-sm">
                Vincular a um protocolo existente
              </label>
            </div>
            
            {isLinkingProtocol && (
              <FormField
                control={form.control}
                name="protocolId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Protocolo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um protocolo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROTOCOLS.map((protocol) => (
                          <SelectItem key={protocol.id} value={protocol.id}>
                            {protocol.id} - {protocol.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              <Button type="submit">Criar conversa</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
