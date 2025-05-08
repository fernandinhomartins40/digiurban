
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

// Mock departments for demonstration
const mockDepartments = [
  "Gabinete do Prefeito",
  "Secretaria de Administração",
  "Secretaria de Educação",
  "Secretaria de Saúde",
  "Secretaria de Assistência Social",
  "Secretaria de Finanças",
  "Departamento de Recursos Humanos",
  "Departamento de Compras",
  "Departamento Jurídico",
  "Departamento de Obras"
];

export default function EmailInterno() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("inbox");
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState<any[]>([]);
  const [sentEmails, setSentEmails] = useState<any[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [viewingEmail, setViewingEmail] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [composing, setComposing] = useState(false);
  const [selectingDocument, setSelectingDocument] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [availableDocuments, setAvailableDocuments] = useState<Document[]>([]);
  const [composeLoading, setComposeLoading] = useState(false);
  
  const { getFilledDocuments, sendInternalEmail, getIncomingEmails, getOutgoingEmails, markEmailAsRead } = useMail();
  
  // Form for composing emails
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      subject: "",
      content: "",
      to_department: "",
    },
  });

  // Load emails and documents when component mounts or department changes
  useEffect(() => {
    if (user?.department) {
      loadEmails();
      loadDocuments();
    }
  }, [user?.department]);
  
  // Load emails for inbox and sent tabs
  const loadEmails = async () => {
    if (!user?.department) return;
    
    setLoading(true);
    try {
      // Load incoming emails for inbox
      const incomingData = await getIncomingEmails(user.department);
      setEmails(incomingData);
      
      // Load outgoing emails for sent
      const outgoingData = await getOutgoingEmails(user.department);
      setSentEmails(outgoingData);
    } catch (error) {
      console.error("Error loading emails:", error);
      toast({
        title: "Erro ao carregar emails",
        description: "Não foi possível carregar os emails. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Load available documents for attachments
  const loadDocuments = async () => {
    try {
      const documents = await getFilledDocuments();
      setAvailableDocuments(documents);
    } catch (error) {
      console.error("Error loading documents:", error);
    }
  };
  
  // Handle email selection
  const handleSelectEmail = async (email: any) => {
    setSelectedEmail(email);
    setViewingEmail(true);
    
    // Mark as read if needed
    if (!email.read_at) {
      try {
        await markEmailAsRead(email.id);
      } catch (error) {
        console.error("Error marking email as read:", error);
      }
    }
  };
  
  // Handle document selection for attachment
  const handleSelectDocument = (document: Document) => {
    const alreadySelected = selectedDocuments.some(doc => doc.id === document.id);
    
    if (alreadySelected) {
      setSelectedDocuments(prevDocs => prevDocs.filter(doc => doc.id !== document.id));
    } else {
      setSelectedDocuments(prevDocs => [...prevDocs, document]);
    }
  };
  
  // Handle email submission
  const onSubmit = async (values: EmailFormValues) => {
    if (!user?.id || !user?.department) {
      toast({
        title: "Erro",
        description: "Usuário não identificado ou departamento não configurado.",
        variant: "destructive",
      });
      return;
    }
    
    setComposeLoading(true);
    
    try {
      // Send the email
      const emailData = await sendInternalEmail({
        subject: values.subject,
        content: values.content,
        from_department: user.department,
        to_department: values.to_department,
        sent_by: user.id,
      });
      
      // Handle attachments if any
      if (selectedDocuments.length > 0 && emailData) {
        // TODO: Implement attachment handling with addEmailAttachment function
        
        toast({
          title: "Anexos adicionados",
          description: `${selectedDocuments.length} documento(s) anexado(s) ao email.`,
        });
      }
      
      toast({
        title: "Email enviado",
        description: "Sua mensagem foi enviada com sucesso.",
      });
      
      // Reset form and state
      form.reset();
      setSelectedDocuments([]);
      setComposing(false);
      
      // Refresh emails list
      loadEmails();
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Erro ao enviar email",
        description: "Ocorreu um erro ao enviar o email. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setComposeLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };
  
  // Filter emails based on search term
  const filteredEmails = activeTab === "inbox" 
    ? emails.filter(email => 
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.from_department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sentEmails.filter(email => 
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.to_department.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Email Interno</h1>
          <p className="text-muted-foreground">
            Envie e receba mensagens internas
          </p>
        </div>
        <Button onClick={() => setComposing(true)}>
          <Mail className="mr-2 h-4 w-4" />
          Novo Email
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Email Navigation */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="py-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-8" 
                  placeholder="Buscar emails..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs 
                defaultValue="inbox" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-4 mx-4">
                  <TabsTrigger value="inbox" className="flex items-center gap-1">
                    <Inbox className="h-4 w-4" />
                    <span>Recebidos</span>
                  </TabsTrigger>
                  <TabsTrigger value="sent" className="flex items-center gap-1">
                    <Send className="h-4 w-4" />
                    <span>Enviados</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="inbox" className="m-0">
                  <div className="flex flex-col">
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : filteredEmails.length > 0 ? (
                      filteredEmails.map((email) => (
                        <div 
                          key={email.id} 
                          className={`px-4 py-3 border-b cursor-pointer hover:bg-muted/50 ${!email.read_at ? 'bg-primary/5 font-medium' : ''}`}
                          onClick={() => handleSelectEmail(email)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="truncate">
                              <p className="font-medium truncate">{email.subject}</p>
                              <p className="text-sm text-muted-foreground">De: {email.from_department}</p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {format(new Date(email.sent_at), "dd/MM/yy")}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">Nenhum email recebido</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="sent" className="m-0">
                  <div className="flex flex-col">
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : sentEmails.length > 0 ? (
                      sentEmails.map((email) => (
                        <div 
                          key={email.id} 
                          className="px-4 py-3 border-b cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSelectEmail(email)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="truncate">
                              <p className="font-medium truncate">{email.subject}</p>
                              <p className="text-sm text-muted-foreground">Para: {email.to_department}</p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {format(new Date(email.sent_at), "dd/MM/yy")}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">Nenhum email enviado</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Email Viewer */}
        <div className="md:col-span-9">
          <Card className="h-full">
            {viewingEmail && selectedEmail ? (
              <>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedEmail.subject}</CardTitle>
                      <CardDescription>
                        {activeTab === "inbox" ? (
                          <>De: <strong>{selectedEmail.from_department}</strong></>
                        ) : (
                          <>Para: <strong>{selectedEmail.to_department}</strong></>
                        )}
                        {" - "}{formatDate(selectedEmail.sent_at)}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Send className="h-4 w-4 mr-1" />
                        Responder
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setViewingEmail(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <Separator />
                
                <CardContent className="py-6">
                  <div className="prose prose-sm max-w-none">
                    {selectedEmail.content.split('\n').map((line: string, i: number) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  
                  {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                    <div className="mt-6 border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-2">Anexos</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedEmail.attachments.map((attachment: any) => (
                          <div 
                            key={attachment.id}
                            className="flex items-center border rounded-md px-3 py-2 bg-muted/50"
                          >
                            <FileText className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-sm">{attachment.file_name}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-2">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-96">
                <Mail className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-medium">Nenhum email selecionado</h3>
                <p className="text-muted-foreground">
                  Selecione um email para visualizá-lo ou envie uma nova mensagem
                </p>
                <Button className="mt-4" onClick={() => setComposing(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Mensagem
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Compose Email Dialog */}
      <Dialog open={composing} onOpenChange={setComposing}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nova Mensagem</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="to_department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Para</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um departamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockDepartments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
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
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assunto</FormLabel>
                    <FormControl>
                      <Input placeholder="Assunto do email" {...field} />
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
                    <FormLabel>Mensagem</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Digite sua mensagem aqui..." 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Attachments */}
              <div>
                <div className="flex items-center justify-between">
                  <FormLabel>Anexos</FormLabel>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectingDocument(true)}
                  >
                    <PaperclipIcon className="h-4 w-4 mr-2" />
                    Anexar Documento
                  </Button>
                </div>
                
                {selectedDocuments.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDocuments.map((doc) => (
                      <Badge key={doc.id} variant="secondary" className="pl-2">
                        {doc.title}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 pl-1"
                          onClick={() => setSelectedDocuments(prevDocs => 
                            prevDocs.filter(d => d.id !== doc.id)
                          )}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remover {doc.title}</span>
                        </Button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    Nenhum documento anexado
                  </p>
                )}
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setComposing(false)}
                  disabled={composeLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={composeLoading}>
                  {composeLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Select Document Dialog */}
      <Dialog open={selectingDocument} onOpenChange={setSelectingDocument}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Selecionar Documentos</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-8" 
                placeholder="Buscar documentos..." 
              />
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <div className="grid gap-0 divide-y">
                {availableDocuments.length > 0 ? (
                  availableDocuments.map((doc) => (
                    <div 
                      key={doc.id} 
                      className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleSelectDocument(doc)}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          checked={selectedDocuments.some(d => d.id === doc.id)}
                          onCheckedChange={() => handleSelectDocument(doc)}
                        />
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.protocol_number} - {format(new Date(doc.created_at), "dd/MM/yyyy")}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p>Nenhum documento disponível</p>
                    <Button variant="link" className="mt-2">
                      Criar Novo Documento
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setSelectingDocument(false)}
              >
                Cancelar
              </Button>
              <Button onClick={() => setSelectingDocument(false)}>
                Confirmar Seleção
                {selectedDocuments.length > 0 && ` (${selectedDocuments.length})`}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
