
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { useToast } from "@/components/ui/use-toast";
import { AttachmentUpload } from "@/components/mail/AttachmentUpload";
import { useMail } from "@/hooks/use-mail";
import { isAdminUser } from "@/types/auth";
import { Template } from "@/types/mail";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2, Mail, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { generateDocumentFormSchema } from "@/schemas/documentForms";
import { TemplateFieldsForm } from "@/components/mail/TemplateFieldsForm";
import { z } from "zod";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function OficioDigital() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [templateId, setTemplateId] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [isCreatingAttachment, setIsCreatingAttachment] = useState(false);
  
  const { 
    getTemplates, 
    getTemplate, 
    documentTypes, 
    createDocument,
    forwardDocument,
    isLoadingCreate,
    isLoadingForward
  } = useMail();
  
  const { data: templates, isLoading: isLoadingTemplates } = getTemplates();
  const { 
    data: template, 
    isLoading: isLoadingTemplate,
    error: templateError 
  } = getTemplate(templateId);
  
  // Update selected template when loaded
  useEffect(() => {
    if (template) {
      setSelectedTemplate(template);
    }
  }, [template]);
  
  // Base schema for document form
  const baseSchema = z.object({
    title: z.string().min(3, "Título é obrigatório"),
    documentTypeId: z.string().min(1, "Tipo de documento é obrigatório"),
    toDepartment: z.string().min(1, "Departamento destino é obrigatório"),
    content: z.string().optional(),
  });
  
  // Generate form schema dynamically based on template fields
  const formSchema = templateId && selectedTemplate?.fields 
    ? generateDocumentFormSchema(selectedTemplate?.fields, baseSchema)
    : baseSchema;
  
  type FormValues = z.infer<typeof formSchema>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      documentTypeId: "",
      content: "",
      toDepartment: "",
    },
  });
  
  // Handle template change
  const handleTemplateChange = (value: string) => {
    setTemplateId(value);
    setDocumentId(null);
    form.reset({
      title: "",
      documentTypeId: template?.document_type_id || "",
      toDepartment: "",
      content: "",
    });
  };
  
  // Update document type when template changes
  useEffect(() => {
    if (template?.document_type_id) {
      form.setValue("documentTypeId", template.document_type_id);
    }
  }, [template, form]);
  
  // Generate document content from template
  const generateContent = (template: Template, fieldValues: Record<string, any>) => {
    let content = template.content;
    
    // Replace template placeholders with field values
    Object.entries(fieldValues).forEach(([key, value]) => {
      // Format dates if the field value is a date string
      let formattedValue = value;
      
      if (value instanceof Date) {
        formattedValue = format(value, 'dd/MM/yyyy');
      } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        try {
          formattedValue = format(new Date(value), 'dd/MM/yyyy');
        } catch (e) {
          // If date parsing fails, use the original value
          formattedValue = value;
        }
      }
      
      // For select fields, get the display text instead of the key
      const field = template.fields?.find(f => f.field_key === key);
      if (field?.field_type === 'select' && field.field_options && typeof value === 'string') {
        const options = field.field_options as Record<string, string>;
        formattedValue = options[value] || value;
      }
      
      content = content.replace(new RegExp(`{{${key}}}`, "g"), formattedValue || "");
    });
    
    return content;
  };
  
  async function onSubmit(values: FormValues) {
    try {
      if (!user || !isAdminUser(user)) {
        toast({
          title: "Erro de permissão",
          description: "Você não tem permissão para criar documentos.",
          variant: "destructive",
        });
        return;
      }

      if (!user.department) {
        toast({
          title: "Departamento não configurado",
          description: "Seu usuário não possui um departamento configurado.",
          variant: "destructive",
        });
        return;
      }

      // Extract field values
      const { title, documentTypeId, toDepartment, content, ...fieldValues } = values;
      
      // Generate content from template if available
      let documentContent = content || "";
      if (selectedTemplate) {
        documentContent = generateContent(selectedTemplate, fieldValues);
      }
      
      if (!documentContent.trim()) {
        toast({
          title: "Conteúdo vazio",
          description: "O documento não pode ter conteúdo vazio.",
          variant: "destructive",
        });
        return;
      }
      
      try {
        setIsCreatingAttachment(true);
        
        // Create document
        const createdDoc = await createDocument({
          title,
          content: documentContent,
          document_type_id: documentTypeId,
          creator_id: user.id,
          department: user.department,
          template_id: selectedTemplate?.id || null,
        });
        
        if (createdDoc) {
          setDocumentId(createdDoc.id);
          
          // Forward document to destination department
          await forwardDocument({
            documentId: createdDoc.id,
            toDepartment,
          });
          
          toast({
            title: "Documento criado com sucesso",
            description: `Protocolo: ${createdDoc.protocol_number}`,
          });
          
          // Keep the form to allow attachment upload
          setIsCreatingAttachment(false);
        }
      } catch (error) {
        setIsCreatingAttachment(false);
        console.error("Error creating document:", error);
        toast({
          title: "Erro ao criar documento",
          description: "Ocorreu um erro ao criar o documento. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro ao processar formulário",
        description: "Ocorreu um erro ao processar o formulário. Tente novamente.",
        variant: "destructive",
      });
    }
  }

  const handleAttachmentComplete = () => {
    toast({
      title: "Anexo adicionado",
      description: "O arquivo foi anexado com sucesso ao documento.",
    });
  };
  
  const handleFinish = () => {
    navigate("/admin/correio/dashboard");
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ofício Digital</h1>
        <p className="text-muted-foreground">
          Crie e envie documentos oficiais para outros departamentos
        </p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail size={20} />
              Criar Novo Documento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {documentId ? (
              <div className="space-y-6">
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">
                    Documento criado com sucesso! Agora você pode adicionar anexos se necessário.
                  </AlertDescription>
                </Alert>

                <div className="border p-4 rounded-md">
                  <h3 className="font-medium mb-2">Anexar Arquivos</h3>
                  <AttachmentUpload 
                    documentId={documentId} 
                    onUploadComplete={handleAttachmentComplete} 
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Você pode anexar vários arquivos ao documento, um de cada vez.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleFinish}>
                    Finalizar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <FormLabel>Modelo de Documento</FormLabel>
                  <Select onValueChange={handleTemplateChange} value={templateId} disabled={isLoadingTemplates}>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingTemplates ? "Carregando modelos..." : "Selecionar modelo ou criar do zero"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Criar do zero (sem modelo)</SelectItem>
                      {templates?.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {templateError && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Erro ao carregar o modelo. Tente novamente ou selecione outro modelo.
                    </AlertDescription>
                  </Alert>
                )}
                
                {isLoadingTemplate && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                )}
                
                {!isLoadingTemplate && (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Título do Documento</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: Solicitação de materiais de escritório" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="documentTypeId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo do Documento</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                                value={field.value || (selectedTemplate?.document_type_id ?? "")}
                                disabled={isLoadingTemplate || documentTypes.isLoading}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {documentTypes.data?.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                      {type.name}
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
                          name="toDepartment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Departamento Destino</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: Financeiro" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Template Fields (dynamic) */}
                      {selectedTemplate?.fields && selectedTemplate.fields.length > 0 ? (
                        <TemplateFieldsForm fields={selectedTemplate.fields} form={form} />
                      ) : (
                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Conteúdo do Documento</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Digite o conteúdo do documento"
                                  className="min-h-32"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate("/admin/correio/dashboard")}
                          disabled={isLoadingCreate || isLoadingForward || isCreatingAttachment}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={isLoadingCreate || isLoadingForward || isCreatingAttachment}
                        >
                          {(isLoadingCreate || isLoadingForward || isCreatingAttachment) ? (
                            <>
                              <Loader2 size={16} className="mr-2 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Send size={16} className="mr-2" />
                              Enviar Documento
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
