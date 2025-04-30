
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
import { useToast } from "@/hooks/use-toast";
import { AttachmentUpload } from "@/components/mail/AttachmentUpload";
import { useMail } from "@/hooks/use-mail";
import { Template, TemplateField } from "@/types/mail";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2, Mail, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";

export default function OficioDigital() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [templateId, setTemplateId] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  
  const { 
    getTemplates, 
    getTemplate, 
    documentTypes, 
    createDocument,
    forwardDocument,
    isLoadingCreate,
    isLoadingForward
  } = useMail();
  
  const { data: templates } = getTemplates();
  const { data: template } = getTemplate(templateId);
  
  // Update selected template when loaded
  useState(() => {
    if (template) {
      setSelectedTemplate(template);
    }
  });
  
  // Generate form schema dynamically based on template fields
  const generateFormSchema = () => {
    if (!selectedTemplate || !selectedTemplate.fields?.length) {
      // Default schema
      return z.object({
        title: z.string().min(3, "O título é obrigatório"),
        documentTypeId: z.string().min(1, "Selecione o tipo de documento"),
        content: z.string().min(10, "O conteúdo é obrigatório"),
        toDepartment: z.string().min(3, "O departamento de destino é obrigatório"),
      });
    }
    
    // Start with base form fields
    let schemaObj: any = {
      title: z.string().min(3, "O título é obrigatório"),
      documentTypeId: z.string().min(1, "Selecione o tipo de documento"),
      toDepartment: z.string().min(3, "O departamento de destino é obrigatório"),
    };
    
    // Add dynamic fields based on template
    selectedTemplate.fields?.forEach((field: TemplateField) => {
      let fieldSchema = z.string();
      
      if (field.is_required) {
        fieldSchema = fieldSchema.min(1, `${field.field_label} é obrigatório`);
      } else {
        fieldSchema = fieldSchema.optional();
      }
      
      schemaObj[field.field_key] = fieldSchema;
    });
    
    return z.object(schemaObj);
  };
  
  const formSchema = generateFormSchema();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      documentTypeId: selectedTemplate?.document_type_id || "",
      content: "",
      toDepartment: "",
    },
  });
  
  // Handle template change
  const handleTemplateChange = (value: string) => {
    setTemplateId(value);
    form.reset({
      title: "",
      documentTypeId: "",
      toDepartment: "",
      content: "",
    });
  };
  
  // Generate document content from template
  const generateContent = (template: Template, fieldValues: Record<string, string>) => {
    let content = template.content;
    
    // Replace template placeholders with field values
    Object.entries(fieldValues).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, "g"), value || "");
    });
    
    return content;
  };
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Extract field values
      const { title, documentTypeId, toDepartment, ...fieldValues } = values;
      
      // Generate content from template if available
      let content = "";
      if (selectedTemplate) {
        content = generateContent(selectedTemplate, fieldValues as Record<string, string>);
      } else {
        content = values.content as string;
      }
      
      // Create document
      const document = await createDocument({
        title,
        content,
        document_type_id: documentTypeId,
        creator_id: user?.id!,
        department: user?.department!,
        template_id: selectedTemplate?.id || null,
      });
      
      setDocumentId(document.id);
      
      // Forward document to destination department
      await forwardDocument({
        documentId: document.id,
        toDepartment,
      });
      
      toast({
        title: "Documento criado com sucesso",
        description: `Protocolo: ${document.protocol_number}`,
      });
      
      // Redirect to dashboard
      navigate("/admin/correio/dashboard");
    } catch (error) {
      console.error("Error creating document:", error);
      toast({
        title: "Erro ao criar documento",
        description: "Ocorreu um erro ao criar o documento. Tente novamente.",
        variant: "destructive",
      });
    }
  }
  
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
            <div className="mb-6">
              <FormLabel>Modelo de Documento</FormLabel>
              <Select onValueChange={handleTemplateChange} value={templateId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar modelo ou criar do zero" />
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
                          value={field.value || (template?.document_type_id ?? "")}
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
                  <div className="space-y-4 border rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Edit size={16} />
                      <h3 className="font-medium">Campos do Modelo</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTemplate.fields.map((field) => (
                        <FormField
                          key={field.id}
                          control={form.control}
                          name={field.field_key as any}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>
                                {field.field_label}
                                {field.is_required && <span className="text-destructive ml-1">*</span>}
                              </FormLabel>
                              <FormControl>
                                {field.field_type === 'textarea' ? (
                                  <Textarea placeholder={field.field_label} {...formField} />
                                ) : field.field_type === 'select' && field.field_options ? (
                                  <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder={`Selecione ${field.field_label}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.entries(field.field_options).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>{value as string}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <Input placeholder={field.field_label} {...formField} />
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        Os campos acima serão inseridos automaticamente no modelo do documento.
                      </p>
                    </div>
                  </div>
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
                
                {documentId && (
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-2">Anexar Arquivos</h3>
                    <AttachmentUpload documentId={documentId} />
                    <p className="text-sm text-muted-foreground mt-2">
                      Você pode anexar arquivos após criar o documento.
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/correio/dashboard")}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoadingCreate || isLoadingForward}>
                    {(isLoadingCreate || isLoadingForward) ? (
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
