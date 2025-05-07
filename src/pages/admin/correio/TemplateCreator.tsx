import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMail } from "@/hooks/use-mail";
import { Template, TemplateField } from "@/types/mail";
import { formatDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { File, Loader2, Plus, Save, Settings, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { isAdminUser } from "@/types/auth";
import { TemplateFieldItem } from "@/components/mail/TemplateFieldItem";
import { toast } from "@/hooks/use-toast";
import { WysiwygEditor } from "@/components/mail/WysiwygEditor";
import { FieldList } from "@/components/mail/FieldList";
import { PredefinedFieldsSelector } from "@/components/mail/PredefinedFieldsSelector";
import { generateFieldId } from "@/utils/mailTemplateUtils";
import { TemplateStarter } from "@/components/mail/TemplateStarter";
import { AutoPopulateFields } from "@/components/mail/AutoPopulateFields";

const templateFormSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório"),
  description: z.string().optional(),
  documentTypeId: z.string().optional(),
  content: z.string().min(10, "Conteúdo é obrigatório"),
  departments: z.array(z.string()).min(1, "Selecione pelo menos um departamento"),
  fields: z.array(
    z.object({
      field_key: z.string().min(1, "Chave é obrigatória"),
      field_label: z.string().min(1, "Rótulo é obrigatório"),
      field_type: z.string().min(1, "Tipo é obrigatório"),
      is_required: z.boolean().default(false),
      field_options: z.any().optional(),
      order_position: z.number().optional(),
    })
  ),
});

export default function TemplateCreator() {
  const { user } = useAuth();
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("editor");
  const [previewContent, setPreviewContent] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const { 
    documentTypes,
    getTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    isLoadingCreateTemplate,
    isLoadingUpdateTemplate,
    isLoadingDeleteTemplate
  } = useMail();
  
  const { data: templates } = getTemplates();
  const { data: currentTemplate, isLoading: isLoadingTemplate } = getTemplate(templateId || "");
  
  const form = useForm<z.infer<typeof templateFormSchema>>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      documentTypeId: "",
      content: "",
      departments: isAdminUser(user) && user?.department ? [user.department] : [],
      fields: [],
    },
  });
  
  const { fields: formFields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });
  
  // Load template data into form
  useEffect(() => {
    if (currentTemplate) {
      form.reset({
        name: currentTemplate.name,
        description: currentTemplate.description || "",
        documentTypeId: currentTemplate.document_type_id || "",
        content: currentTemplate.content,
        departments: currentTemplate.departments || [],
        fields: currentTemplate.fields?.map((field) => ({
          field_key: field.field_key,
          field_label: field.field_label,
          field_type: field.field_type,
          is_required: field.is_required,
          field_options: field.field_options,
          order_position: field.order_position,
        })) || [],
      });
      
      // Generate preview
      updatePreview(currentTemplate.content);
    }
  }, [currentTemplate, form]);
  
  // Update preview when content changes
  const content = form.watch("content");
  const templateFields = form.watch("fields");
  
  useEffect(() => {
    updatePreview(content);
  }, [content, templateFields]);
  
  const updatePreview = (content: string) => {
    let previewHtml = content;
    
    // Replace placeholders with sample data
    form.getValues("fields").forEach((field) => {
      let sampleValue = `<span class="bg-primary/20 px-1 rounded">${field.field_label}</span>`;
      previewHtml = previewHtml.replace(
        new RegExp(`{{${field.field_key}}}`, "g"),
        sampleValue
      );
    });
    
    setPreviewContent(previewHtml);
  };
  
  const handleAddField = () => {
    append({
      field_key: "",
      field_label: "",
      field_type: "text",
      is_required: false,
      field_options: {},
      order_position: formFields.length,
    });
  };
  
  // Add predefined fields
  const handleAddPredefinedFields = (fields: Partial<TemplateField>[]) => {
    // Get current field keys
    const currentFieldKeys = form.getValues("fields").map(field => field.field_key);
    
    // Filter out fields that already exist
    const newFields = fields.filter(
      field => field.field_key && !currentFieldKeys.includes(field.field_key)
    );
    
    // Add the new fields
    newFields.forEach(field => {
      append({
        field_key: field.field_key || "",
        field_label: field.field_label || "",
        field_type: field.field_type || "text",
        is_required: field.is_required || false,
        field_options: field.field_options || {},
        order_position: formFields.length,
      });
    });
  };
  
  // Handle template starter selection
  const handleApplyTemplate = (templateContent: string) => {
    form.setValue("content", templateContent);
    updatePreview(templateContent);
    toast({
      title: "Modelo aplicado",
      description: "O modelo inicial foi aplicado com sucesso."
    });
  };
  
  // Handle auto-populate fields
  const handleAutoPopulateFields = (populatedContent: string) => {
    form.setValue("content", populatedContent);
    updatePreview(populatedContent);
    toast({
      title: "Campos inseridos",
      description: "Os campos foram inseridos automaticamente no documento."
    });
  };
  
  // Handle field drag start
  const handleFieldDragStart = (e: React.DragEvent, fieldKey: string) => {
    e.dataTransfer.setData("text/plain", `{{${fieldKey}}}`);
  };

  // Handle field click - insert at cursor position
  const handleFieldClick = (fieldKey: string) => {
    // The actual insertion is handled by the WysiwygEditor component
    const customEvent = new CustomEvent('insert-field', { 
      detail: { fieldKey } 
    });
    document.dispatchEvent(customEvent);
  };
  
  // Get current field keys
  const getCurrentFieldKeys = () => {
    return form.getValues("fields").map(field => field.field_key);
  };
  
  // Handle template selection from the sidebar
  const handleTemplateSelect = (id: string) => {
    setTemplateId(id);
  };

  // Handle creating a new template
  const handleCreateNew = () => {
    setTemplateId(null);
    form.reset({
      name: "",
      description: "",
      documentTypeId: "",
      content: "",
      departments: isAdminUser(user) && user?.department ? [user.department] : [],
      fields: [],
    });
    setCurrentTab("editor");
  };

  // Handle deleting a template
  const handleDeleteTemplate = async () => {
    if (templateId) {
      try {
        await deleteTemplate(templateId);
        setTemplateId(null);
        handleCreateNew();
        toast({
          title: "Modelo excluído",
          description: "O modelo foi excluído com sucesso."
        });
        setConfirmDelete(false);
      } catch (error) {
        console.error("Error deleting template:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir o modelo.",
          variant: "destructive"
        });
      }
    }
  };
  
  async function onSubmit(values: z.infer<typeof templateFormSchema>) {
    try {
      if (!user || !isAdminUser(user)) {
        return toast({
          title: "Erro de permissão",
          description: "Você não tem permissão para criar ou editar modelos.",
          variant: "destructive"
        });
      }
      
      // Process field options to ensure they're properly formatted
      const processedFields = values.fields.map((field, index) => {
        let processedField = { ...field, order_position: index };
        
        // Ensure field_options is a proper object if it's for a select type
        if (field.field_type === "select") {
          try {
            if (typeof field.field_options === "string") {
              processedField.field_options = JSON.parse(field.field_options);
            }
          } catch (error) {
            console.error("Error parsing field options:", error);
            toast({
              title: "Erro no formato",
              description: `As opções do campo "${field.field_label}" não estão em formato JSON válido.`,
              variant: "destructive"
            });
            throw new Error("Invalid field options format");
          }
        }
        
        return processedField;
      });
      
      // Create or update template
      if (templateId) {
        try {
          const result = await updateTemplate({
            id: templateId,
            template: {
              name: values.name,
              description: values.description,
              document_type_id: values.documentTypeId || null,
              content: values.content,
              departments: values.departments,
            },
            fields: processedFields,
          });
          
          if (result) {
            setCurrentTab("editor");
            toast({
              title: "Modelo atualizado",
              description: "O modelo foi atualizado com sucesso."
            });
          }
        } catch (error) {
          console.error("Error updating template:", error);
          toast({
            title: "Erro",
            description: "Ocorreu um erro ao atualizar o modelo.",
            variant: "destructive"
          });
        }
      } else {
        try {
          const result = await createTemplate({
            template: {
              name: values.name,
              description: values.description,
              document_type_id: values.documentTypeId || null,
              content: values.content,
              departments: values.departments,
            },
            fields: processedFields,
          });
          
          if (result) {
            setTemplateId(result.id);
            setCurrentTab("editor");
            toast({
              title: "Modelo criado",
              description: "O modelo foi criado com sucesso."
            });
          }
        } catch (error) {
          console.error("Error creating template:", error);
          toast({
            title: "Erro",
            description: "Ocorreu um erro ao criar o modelo.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error saving template:", error);
    }
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Criador de Ofícios</h1>
        <p className="text-muted-foreground">
          Crie e gerencie modelos de ofícios para seu departamento
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Templates List */}
        <Card className="w-full lg:w-64 h-min">
          <CardHeader>
            <CardTitle className="text-base">Modelos Salvos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleCreateNew}
              >
                <Plus size={16} className="mr-2" />
                Novo Modelo
              </Button>
              
              <div className="space-y-1 mt-4">
                {templates?.map((template) => (
                  <Button
                    key={template.id}
                    variant={templateId === template.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <File size={16} className="mr-2" />
                    <span className="truncate">{template.name}</span>
                  </Button>
                ))}
                
                {!templates?.length && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    Nenhum modelo salvo
                  </p>
                )}
                
                {isLoadingTemplate && (
                  <div className="flex justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Template Editor */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {templateId ? "Editar Modelo" : "Novo Modelo"}
                {templateId && currentTemplate && (
                  <Badge variant="outline" className="ml-2">
                    Criado em {formatDate(currentTemplate.created_at)}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Tabs defaultValue="editor" value={currentTab} onValueChange={setCurrentTab}>
                    <TabsList>
                      <TabsTrigger value="editor">Editor</TabsTrigger>
                      <TabsTrigger value="fields">Campos</TabsTrigger>
                      <TabsTrigger value="preview">Visualizar</TabsTrigger>
                      <TabsTrigger value="settings">Configurações</TabsTrigger>
                    </TabsList>
                    
                    {/* Editor Tab */}
                    <TabsContent value="editor" className="space-y-6 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome do Modelo</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: Solicitação de Diária" {...field} />
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
                              <FormLabel>Tipo de Documento</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="none">Nenhum</SelectItem>
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
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição do Modelo</FormLabel>
                            <FormControl>
                              <Input placeholder="Descrição breve do modelo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TemplateStarter 
                            fields={currentTemplate?.fields || []} 
                            onSelect={handleApplyTemplate}
                          />
                          <AutoPopulateFields
                            fields={currentTemplate?.fields || []}
                            content={form.getValues("content")}
                            onPopulate={handleAutoPopulateFields}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2">
                          <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Conteúdo do Modelo</FormLabel>
                                <FormControl>
                                  <WysiwygEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Digite o conteúdo do modelo ou arraste campos para inserir"
                                    error={!!form.formState.errors.content}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="lg:col-span-1">
                          <FieldList 
                            fields={currentTemplate?.fields || []}
                            onFieldDragStart={handleFieldDragStart}
                            onFieldClick={handleFieldClick}
                          />
                        </div>
                      </div>
                      
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">
                          Arraste campos do painel lateral para o editor ou use <code className="bg-muted-foreground/20 p-0.5 rounded">{"{{nome_campo}}"}</code>.
                          Os campos devem ser definidos na aba "Campos".
                        </p>
                      </div>
                    </TabsContent>
                    
                    {/* Fields Tab */}
                    <TabsContent value="fields" className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Campos do Modelo</h3>
                            <Button type="button" onClick={handleAddField}>
                              <Plus size={16} className="mr-2" />
                              Adicionar Campo
                            </Button>
                          </div>
                          
                          <div className="space-y-4">
                            {formFields.length === 0 ? (
                              <div className="border rounded-md p-6 text-center">
                                <p className="text-muted-foreground">
                                  Nenhum campo adicionado. Adicione campos manualmente ou use os campos predefinidos.
                                </p>
                              </div>
                            ) : (
                              formFields.map((field, index) => (
                                <TemplateFieldItem
                                  key={field.id}
                                  index={index}
                                  onRemove={() => remove(index)}
                                  form={form}
                                />
                              ))
                            )}
                          </div>
                        </div>
                        
                        <div className="md:col-span-1">
                          <PredefinedFieldsSelector 
                            onAddFields={handleAddPredefinedFields} 
                            existingFieldKeys={getCurrentFieldKeys()}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Preview Tab */}
                    <TabsContent value="preview" className="pt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Visualização do Modelo</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="border rounded-md p-6 bg-white">
                            <div dangerouslySetInnerHTML={{ __html: previewContent }} />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6 pt-4">
                      <FormField
                        control={form.control}
                        name="departments"
                        render={() => (
                          <FormItem>
                            <FormLabel>Departamentos que podem usar este modelo</FormLabel>
                            <FormControl>
                              <div className="border rounded-md p-3">
                                {/* This would ideally be a multi-select, but for simplicity let's hardcode a few options */}
                                {["Administração", "Financeiro", "RH", "Compras", "Educação"].map((dept) => (
                                  <FormField
                                    key={dept}
                                    control={form.control}
                                    name="departments"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={dept}
                                          className="flex flex-row items-start space-x-3 space-y-0 py-1"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(dept)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, dept])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== dept
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {dept}
                                          </FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {templateId && (
                        <div className="border-t pt-4">
                          <h3 className="text-lg font-medium text-destructive mb-2">Zona de Perigo</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            As ações abaixo não podem ser desfeitas.
                          </p>
                          
                          <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                            <DialogTrigger asChild>
                              <Button variant="destructive">
                                <Trash2 size={16} className="mr-2" />
                                Excluir Modelo
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Excluir Modelo</DialogTitle>
                                <DialogDescription>
                                  Tem certeza que deseja excluir este modelo? Esta ação não pode ser desfeita.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button 
                                  variant="outline" 
                                  type="button" 
                                  onClick={() => setConfirmDelete(false)}
                                >
                                  Cancelar
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  onClick={handleDeleteTemplate}
                                  disabled={isLoadingDeleteTemplate}
                                >
                                  {isLoadingDeleteTemplate ? (
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                  ) : (
                                    <Trash2 size={16} className="mr-2" />
                                  )}
                                  Excluir
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentTab("editor")}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isLoadingCreateTemplate || isLoadingUpdateTemplate}
                    >
                      {(isLoadingCreateTemplate || isLoadingUpdateTemplate) ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          Salvar Modelo
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
    </div>
  );
}
