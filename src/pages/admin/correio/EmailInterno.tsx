
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMail } from "@/hooks/use-mail";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Document } from "@/types/mail";
import { isAdminUser } from "@/types/auth";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Icons
import {
  Mail,
  Inbox,
  Send,
  PaperclipIcon,
  FileText,
  Plus,
  Search,
  Loader2,
  X,
  ExternalLink,
  Download
} from "lucide-react";
import { MultipleDestinationsSelector } from '@/components/mail/MultipleDestinationsSelector';

// Form schema
const emailSchema = z.object({
  subject: z.string().min(3, "Assunto é obrigatório"),
  content: z.string().min(5, "Conteúdo é obrigatório"),
  to_department: z.string().min(1, "Destinatário é obrigatório"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export default function EmailInterno() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("compose");
  
  const {
    sendInternalEmail,
    getIncomingEmails,
    getOutgoingEmails,
    isLoadingSendEmail
  } = useMail();
  
  // Get emails
  const { data: incomingEmails, isLoading: isLoadingIncoming } = getIncomingEmails();
  const { data: outgoingEmails, isLoading: isLoadingOutgoing } = getOutgoingEmails();
  
  // Form
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      subject: "",
      content: "",
      to_department: "",
    },
  });
  
  // Handle form submit
  const onSubmit = async (values: EmailFormValues) => {
    try {
      if (!user || !isAdminUser(user)) {
        toast({
          title: "Erro de permissão",
          description: "Você não tem permissão para enviar emails.",
          variant: "destructive",
        });
        return;
      }
      
      await sendInternalEmail({
        subject: values.subject,
        content: values.content,
        to_department: values.to_department
      });
      
      toast({
        title: "Email enviado",
        description: "Seu email foi enviado com sucesso.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Erro ao enviar email",
        description: "Ocorreu um erro ao enviar o email. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Email Interno</h1>
        <p className="text-muted-foreground">
          Envie e receba mensagens internas entre departamentos
        </p>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="compose" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Novo Email</span>
          </TabsTrigger>
          <TabsTrigger value="inbox" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            <span>Recebidos</span>
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            <span>Enviados</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Compose Email */}
        <TabsContent value="compose" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Novo Email Interno</CardTitle>
              <CardDescription>
                Envie uma mensagem para outro departamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="to_department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Para</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o departamento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Gabinete do Prefeito">Gabinete do Prefeito</SelectItem>
                            <SelectItem value="Secretaria de Administração">Secretaria de Administração</SelectItem>
                            <SelectItem value="Secretaria de Educação">Secretaria de Educação</SelectItem>
                            <SelectItem value="Secretaria de Saúde">Secretaria de Saúde</SelectItem>
                            <SelectItem value="Secretaria de Obras">Secretaria de Obras</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assunto</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Textarea 
                            className="min-h-[200px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4 flex justify-end">
                    <Button 
                      type="submit"
                      disabled={isLoadingSendEmail}
                    >
                      {isLoadingSendEmail ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Enviar Email
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Inbox Tab */}
        <TabsContent value="inbox" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Caixa de Entrada</CardTitle>
              <CardDescription>
                Emails recebidos de outros departamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingIncoming ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : incomingEmails && incomingEmails.length > 0 ? (
                <div className="space-y-4">
                  {incomingEmails.map((email) => (
                    <Card key={email.id} className={!email.read_at ? "border-primary" : ""}>
                      <CardHeader className="p-4">
                        <div className="flex justify-between">
                          <div>
                            <CardTitle className="text-base">{email.subject}</CardTitle>
                            <CardDescription>
                              De: {email.from_department} • {format(new Date(email.sent_at), 'PPp', { locale: ptBR })}
                            </CardDescription>
                          </div>
                          {!email.read_at && (
                            <Badge>Novo</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="line-clamp-2">{email.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Inbox className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>Nenhum email recebido</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sent Tab */}
        <TabsContent value="sent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Emails Enviados</CardTitle>
              <CardDescription>
                Histórico de emails que você enviou
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingOutgoing ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : outgoingEmails && outgoingEmails.length > 0 ? (
                <div className="space-y-4">
                  {outgoingEmails.map((email) => (
                    <Card key={email.id}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">{email.subject}</CardTitle>
                        <CardDescription>
                          Para: {email.to_department} • {format(new Date(email.sent_at), 'PPp', { locale: ptBR })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="line-clamp-2">{email.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Send className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>Nenhum email enviado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
