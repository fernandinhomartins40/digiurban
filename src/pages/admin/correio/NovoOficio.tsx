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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AttachmentUpload } from "@/components/mail/AttachmentUpload";
import { useMail } from "@/hooks/use-mail";
import { isAdminUser } from "@/types/auth";
import { Template } from "@/types/mail";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2, Mail, Send, Download, FileText, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { generateDocumentFormSchema } from "@/schemas/documentForms";
import { TemplateFieldsForm } from "@/components/mail/TemplateFieldsForm";
import { z } from "zod";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { MultipleDestinationsSelector } from "@/components/mail/MultipleDestinationsSelector";

export default function NovoOficio() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [templateId, setTemplateId] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [isCreatingAttachment, setIsCreatingAttachment] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [destinations, setDestinations] = useState<string[]>([]);
  
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
    },
  });
  
  // Handle template change
  const handleTemplateChange = (value: string) => {
    if (value === "none") {
      // Redirect to the old creator if they select "none"
      navigate("/admin/correio/criador-oficios");
      return;
    }
    
    setTemplateId(value);
    setDocumentId(null);
    form.reset({
      title: "",
      documentTypeId: template?.document_type_id || "",
    });
  };
  
  // Update document type when template changes
  useEffect(() => {
    if (template?.document_type_id) {
      form.setValue("documentTypeId", template.document_type_id);
    }
    
    // Set a default title based on template name
    if (template?.name) {
      form.setValue("title", template.name);
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
    
    // Generate HTML preview
    setPreviewHtml(content);
    
    return content;
  };

  // Preview document
  const handlePreview = () => {
    const values = form.getValues();
    if (selectedTemplate) {
      const { title, documentTypeId, ...fieldValues } = values;
      generateContent(selectedTemplate, fieldValues);
    }
  };
  
  // Update preview as fields change
  useEffect(() => {
    const subscription = form.watch(() => {
      handlePreview();
    });
    return () => subscription.unsubscribe();
  }, [form, selectedTemplate]);
  
  // Handle destinations
  const handleDestinationsChange = (newDestinations: string[]) => {
    setDestinations(newDestinations);
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
      
      if (destinations.length === 0) {
        toast({
          title: "Destinatário não selecionado",
          description: "Selecione pelo menos um departamento de destino.",
          variant: "destructive",
        });
        return;
      }

      // Extract field values
      const { title, documentTypeId, ...fieldValues } = values;
      
      // Generate content from template
      let documentContent = "";
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
          
          // Forward document to all destinations
          const forwardPromises = destinations.map(toDepartment => 
            forwardDocument({
              documentId: createdDoc.id,
              toDepartment,
            })
          );
          
          await Promise.all(forwardPromises);
          
          toast({
            title: "Documento criado e enviado com sucesso",
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
        <h1 className="text-2xl font-bold tracking-tight">Novo Ofício</h1>
        <p className="text-muted-foreground">
          Preencha o modelo para criar e enviar um ofício digital
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-5">
        {/* Form Section - 3 columns */}
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail size={20} />
                Criar Novo Ofício
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
                        <SelectValue placeholder={isLoadingTemplates ? "Carregando modelos..." : "Selecione um modelo"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Criar modelo personalizado</SelectItem>
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
                  
                  {!isLoadingTemplate && templateId && (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Título do Documento</FormLabel>
                                <FormControl>
                                  <Input {...field} />
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
                          
                          <div>
                            <FormLabel>Destinatários</FormLabel>
                            <MultipleDestinationsSelector
                              selectedDestinations={destinations}
                              onChange={handleDestinationsChange}
                            />
                            {destinations.length === 0 && (
                              <p className="text-sm text-destructive mt-1">
                                Selecione pelo menos um departamento de destino
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Template Fields (dynamic) */}
                        {selectedTemplate?.fields && selectedTemplate.fields.length > 0 && (
                          <TemplateFieldsForm fields={selectedTemplate.fields} form={form} />
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
                                Enviar Ofício
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
        
        {/* Preview Section - 2 columns */}
        <div className="md:col-span-2">
          <Card className="sticky top-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Visualização</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8" 
                  onClick={handlePreview}
                  disabled={!selectedTemplate}
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedTemplate ? (
                <div className="text-center p-8 border rounded-md border-dashed">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Selecione um modelo para visualizar o documento
                  </p>
                </div>
              ) : previewHtml ? (
                <div className="border rounded-md overflow-hidden">
                  <div 
                    className="prose prose-sm max-w-none p-4 max-h-[60vh] overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </div>
              ) : (
                <div className="text-center p-8 border rounded-md border-dashed">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Preencha os campos para visualizar o documento
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
