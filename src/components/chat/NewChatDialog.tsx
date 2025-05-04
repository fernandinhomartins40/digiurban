
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useChat, ChatContact, ChatType } from "@/contexts/ChatContext";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { Search, User, Building2, Shield } from "lucide-react";

// Mock protocols
const PROTOCOLS = [
  { id: "2025-000123", title: "Solicitação de material escolar" },
  { id: "2025-000124", title: "Consulta de agendamento médico" },
  { id: "2025-000125", title: "Análise de projeto urbano" },
  { id: "2025-000126", title: "Manutenção de calçada" },
  { id: "2025-000127", title: "Iluminação pública" }
];

const formSchema = z.object({
  contactId: z.string().min(1, "Selecione um contato"),
  title: z.string().optional(),
  protocolId: z.string().optional(),
  linkProtocol: z.boolean().default(false),
  message: z.string().optional(),
});

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialContactId?: string | null;
}

export function NewChatDialog({
  open,
  onOpenChange,
  initialContactId = null
}: NewChatDialogProps) {
  const { contacts, createConversation, setActiveConversation, sendMessage } = useChat();
  const [contactType, setContactType] = useState<"departments" | "citizens" | "admins">("departments");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactId: initialContactId || "",
      title: "",
      protocolId: "",
      linkProtocol: false,
      message: "",
    },
  });
  
  // Update contactId when initialContactId changes
  useEffect(() => {
    if (initialContactId) {
      form.setValue("contactId", initialContactId);
    }
  }, [initialContactId, form]);
  
  // Filter contacts by type and search query
  const filteredContacts = contacts.filter(contact => {
    // Filter by type
    if (contactType === "departments" && contact.type !== "department") return false;
    if (contactType === "citizens" && contact.type !== "citizen") return false;
    if (contactType === "admins" && contact.type !== "admin") return false;
    
    // Filter by search query
    if (searchQuery && !contact.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Validate required fields
      if (!values.contactId) {
        toast({
          title: "Erro",
          description: "Selecione um contato para iniciar a conversa.",
          variant: "destructive",
        });
        return;
      }

      // Determine chat type based on contact type
      const contact = contacts.find(c => c.id === values.contactId);
      if (!contact) {
        toast({
          title: "Erro",
          description: "Contato não encontrado.",
          variant: "destructive",
        });
        return;
      }
      
      // Determine chat type - if contact is citizen then type is internal, otherwise citizen
      const chatType: ChatType = contact.type === "citizen" ? "internal" : "citizen";

      // Create the conversation with the correct chat type
      const conversationId = await createConversation(
        chatType,
        values.contactId,
        values.title || undefined,
        values.linkProtocol && values.protocolId ? [values.protocolId] : undefined
      );
      
      // If there's an initial message, send it
      if (values.message && values.message.trim()) {
        await sendMessage(conversationId, values.message);
      }
      
      // Set it as the active conversation
      setActiveConversation(conversationId);
      
      // Close the dialog
      onOpenChange(false);
      form.reset();
      
      toast({
        title: "Conversa criada",
        description: "A nova conversa foi iniciada com sucesso.",
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

  const renderContactItem = (contact: ChatContact) => (
    <div 
      key={contact.id}
      className="flex items-center p-2 rounded-md cursor-pointer hover:bg-muted"
      onClick={() => {
        form.setValue("contactId", contact.id);
        form.clearErrors("contactId");
      }}
    >
      <div className="relative mr-3">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          {contact.type === "department" ? (
            <Building2 size={16} />
          ) : contact.type === "admin" ? (
            <Shield size={16} />
          ) : (
            <User size={16} />
          )}
        </div>
        
        <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-background ${
          contact.status === "online" ? "bg-green-500" : 
          contact.status === "away" ? "bg-yellow-500" : "bg-gray-400"
        }`}></span>
      </div>
      
      <div className="flex-1 min-w-0">
        <span className="font-medium truncate text-sm">{contact.name}</span>
        {contact.departmentName && (
          <p className="text-xs text-muted-foreground truncate">
            {contact.departmentName}
          </p>
        )}
        {contact.type === "department" && (
          <p className="text-xs text-muted-foreground truncate">
            Departamento Municipal
          </p>
        )}
      </div>
      
      <div className={`w-4 h-4 rounded-full border ${
        form.getValues("contactId") === contact.id 
          ? "bg-primary border-primary" 
          : "border-muted-foreground"
      }`}>
        {form.getValues("contactId") === contact.id && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova conversa</DialogTitle>
          <DialogDescription>
            Selecione com quem você deseja conversar.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Contact Selection */}
            <FormField
              control={form.control}
              name="contactId"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Selecione um contato</FormLabel>
                  
                  <div className="border rounded-md p-2">
                    <div className="mb-2">
                      <Input
                        placeholder="Buscar contato..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-2"
                      />
                      <Tabs 
                        defaultValue="departments" 
                        onValueChange={(value) => setContactType(value as any)}
                        className="w-full"
                      >
                        <TabsList className="w-full grid grid-cols-3">
                          <TabsTrigger value="departments">Setores</TabsTrigger>
                          <TabsTrigger value="citizens">Cidadãos</TabsTrigger>
                          <TabsTrigger value="admins">Servidores</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    
                    <div className="max-h-[200px] overflow-y-auto">
                      {filteredContacts.length > 0 ? (
                        filteredContacts.map(renderContactItem)
                      ) : (
                        <div className="py-4 text-center text-muted-foreground">
                          <p>Nenhum contato encontrado</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Optional Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da conversa (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Solicitação de informações" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Protocol Linking */}
            <FormField
              control={form.control}
              name="linkProtocol"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Vincular a um protocolo existente
                  </FormLabel>
                </FormItem>
              )}
            />
            
            {form.watch("linkProtocol") && (
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
            
            {/* First message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem inicial (opcional)</FormLabel>
                  <FormControl>
                    <textarea 
                      className="w-full min-h-[100px] p-2 border rounded-md" 
                      placeholder="Digite sua mensagem inicial..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Iniciar conversa</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
