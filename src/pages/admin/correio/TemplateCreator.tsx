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
import { File, Image, Loader2, Plus, Save, Settings, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, FieldArrayWithId } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { isAdminUser } from "@/types/auth";
import { toast } from "@/hooks/use-toast";
import { WysiwygEditor } from "@/components/mail/WysiwygEditor";
import { FieldCreationPanel } from "@/components/mail/FieldCreationPanel";
import { TemplateStarter } from "@/components/mail/TemplateStarter";
import { AutoPopulateFields } from "@/components/mail/AutoPopulateFields";
import { generateFieldId } from "@/utils/mailTemplateUtils";
import { ImageUploader } from "@/components/mail/ImageUploader";

const templateFormSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório"),
  description: z.string().optional(),
  documentTypeId: z.string().optional(),
  content: z.string().min(10, "Conteúdo é obrigatório"),
  header: z.string().optional(),
  footer: z.string().optional(),
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
  const [previewHeader, setPreviewHeader] = useState("");
  const [previewFooter, setPreviewFooter] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedTemplateType, setSelectedTemplateType] = useState<'content' | 'header' | 'footer'>('content');
  const [showPredefinedFields, setShowPredefinedFields] = useState(false);
  const [isTemplateSelected, setIsTemplateSelected] = useState(false);
  
  const { 
    documentTypes,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    isLoadingCreateTemplate,
    isLoadingUpdateTemplate,
    isLoadingDeleteTemplate
  } = useMail();
  
  const { data: currentTemplate, isLoading: isLoadingTemplate } = getTemplate(templateId || "");
  
  const form = useForm<z.infer<typeof templateFormSchema>>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      documentTypeId: "",
      content: "",
      header: "",
      footer: "",
      departments: isAdminUser(user) && user?.department ? [user.department] : [],
      fields: [],
    },
  });
  
  const { fields: formFields, append, update, remove } = useFieldArray({
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
        header: currentTemplate.header || "",
        footer: currentTemplate.footer || "",
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
      
      setIsTemplateSelected(true);
      
      // Generate preview
      updatePreview(
        currentTemplate.content, 
        currentTemplate.header || "", 
        currentTemplate.footer || ""
      );
    }
  }, [currentTemplate, form]);
  
  // Check URL params for template duplication or editing
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const duplicateId = queryParams.get('duplicate');
    const editId = queryParams.get('edit');
    
    if (editId) {
      setTemplateId(editId);
    } else if (duplicateId) {
      // Handle template duplication logic
      // This will be handled by the getTemplate() effect above
      setTemplateId(duplicateId);
      // Clear the ID to create a new template based on the duplicate
      setTimeout(() => {
        setTemplateId(null);
        form.setValue("name", `Cópia de ${form.getValues("name")}`);
      }, 500);
    }
  }, []);
  
  // Update preview when content changes
  const content = form.watch("content");
  const header = form.watch("header");
  const footer = form.watch("footer");
  const templateFields = form.watch("fields");
  
  useEffect(() => {
    updatePreview(content, header, footer);
  }, [content, header, footer, templateFields]);
  
  const updatePreview = (
    contentHtml: string, 
    headerHtml: string, 
    footerHtml: string
  ) => {
    // Get all fields
    const fields = form.getValues("fields");
    
    // Function to replace placeholders with sample data
    const replacePlaceholders = (html: string) => {
      let processedHtml = html;
      fields.forEach((field) => {
        let sampleValue = `<span class="bg-primary/20 px-1 rounded">${field.field_label}</span>`;
        processedHtml = processedHtml.replace(
          new RegExp(`{{${field.field_key}}}`, "g"),
          sampleValue
        );
      });
      return processedHtml;
    };
    
    // Process each section
    setPreviewHeader(replacePlaceholders(headerHtml));
    setPreviewContent(replacePlaceholders(contentHtml));
    setPreviewFooter(replacePlaceholders(footerHtml));
  };
  
  const handleAddField = (field: Partial<TemplateField>) => {
    append({
      field_key: field.field_key || generateFieldId(),
      field_label: field.field_label || '',
      field_type: field.field_type || 'text',
      is_required: field.is_required || false,
      field_options: field.field_options || {},
      order_position: formFields.length,
    });
    
    toast({
      title: "Campo adicionado",
      description: `Campo "${field.field_label}" adicionado com sucesso.`
    });
  };
  
  const handleUpdateField = (index: number, field: Partial<TemplateField>) => {
    update(index, {
      field_key: field.field_key || '',
      field_label: field.field_label || '',
      field_type: field.field_type || 'text',
      is_required: field.is_required || false,
      field_options: field.field_options || {},
      order_position: index,
    });
    
    toast({
      title: "Campo atualizado",
      description: `Campo "${field.field_label}" atualizado com sucesso.`
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
        field_key: field.field_key || generateFieldId(),
        field_label: field.field_label || '',
        field_type: field.field_type || 'text',
        is_required: field.is_required || false,
        field_options: field.field_options || {},
        order_position: formFields.length,
      });
    });
    
    if (newFields.length > 0) {
      toast({
        title: "Campos adicionados",
        description: `${newFields.length} campos predefinidos foram adicionados.`
      });
    }
  };
  
  // Handle template starter selection with field integration
  const handleApplyTemplate = (templateContent: string, templateFields: Partial<TemplateField>[]) => {
    form.setValue("content", templateContent);
    
    // Clear existing fields and add the template fields
    form.setValue("fields", []);
    
    // Add template fields
    if (templateFields && templateFields.length > 0) {
      templateFields.forEach(field => {
        append({
          field_key: field.field_key || generateFieldId(),
          field_label: field.field_label || '',
          field_type: field.field_type || 'text',
          is_required: field.is_required || false,
          field_options: field.field_options || {},
          order_position: formFields.length,
        });
      });
    }
    
    setIsTemplateSelected(true);
    updatePreview(templateContent, header, footer);
    
    toast({
      title: "Modelo aplicado",
      description: "O modelo e seus campos foram aplicados com sucesso."
    });
  };
  
  // Handle auto-populate fields
  const handleAutoPopulateFields = (populatedContent: string) => {
    form.setValue("content", populatedContent);
    updatePreview(populatedContent, header, footer);
    toast({
      title: "Campos inseridos",
      description: "Os campos foram inseridos automaticamente no documento."
    });
  };
  
  // Handle field drag start
  const handleFieldDragStart = (
    e: React.DragEvent, 
    fieldKey: string, 
    field?: Partial<TemplateField>
  ) => {
    e.dataTransfer.setData("text/plain", `{{${fieldKey}}}`);
    if (field) {
      e.dataTransfer.setData("field/json", JSON.stringify(field));
    }
  };

  // Handle field click - insert at cursor position
  const handleFieldClick = (fieldKey: string) => {
    // The actual insertion is handled by the WysiwygEditor component
    const customEvent = new CustomEvent('insert-field', { 
      detail: { fieldKey, targetField: selectedTemplateType } 
    });
    document.dispatchEvent(customEvent);
  };
  
  // Get current field keys
  const getCurrentFieldKeys = () => {
    return form.getValues("fields").map(field => field.field_key);
  };
  
  // Handle creating a new template
  const handleCreateNew = () => {
    setTemplateId(null);
    form.reset({
      name: "",
      description: "",
      documentTypeId: "",
      content: "",
      header: "",
      footer: "",
      departments: isAdminUser(user) && user?.department ? [user.department] : [],
      fields: [],
    });
    setCurrentTab("editor");
    setIsTemplateSelected(false);
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
  
  // Handle editor drop zone 
  const handleEditorDrop = (e: DragEvent) => {
    // This is now handled by the editor directly
    return false;
  };
  
  // Toggle showing predefined fields
  const togglePredefinedFields = () => {
    setShowPredefinedFields(!showPredefinedFields);
  };
  
  // Handle insert image in header
  const handleInsertImage = (imageUrl: string) => {
    const imageHtml = `<img src="${imageUrl}" alt="Imagem cabeçalho" style="max-height: 100px; max-width: 100%;" />`;
    
    // Get current header content
    const currentHeader = form.getValues("header") || "";
    
    // Insert image at the beginning of the header
    form.setValue("header", `${imageHtml}${currentHeader}`);
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
              header: values.header || null,
              footer: values.footer || null,
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
              header: values.header || null,
              footer: values.footer || null,
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
      
      <div className="w-full">
        {/* Template Editor */}
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
                          fields={formFields} 
                          onSelect={handleApplyTemplate}
                        />
                        {isTemplateSelected && (
                          <AutoPopulateFields
                            fields={formFields}
                            content={form.getValues("content")}
                            onPopulate={handleAutoPopulateFields}
                          />
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* Header section */}
                        <div className="lg:col-span-12">
                          <FormField
                            control={form.control}
                            name="header"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center justify-between">
                                  <FormLabel>Cabeçalho do Documento</FormLabel>
                                  <ImageUploader onImageUploaded={handleInsertImage}>
                                    <Button type="button" variant="outline" size="sm">
                                      <Image className="h-4 w-4 mr-1" /> Adicionar Imagem
                                    </Button>
                                  </ImageUploader>
                                </div>
                                <FormControl>
                                  <WysiwygEditor
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    placeholder="Digite o cabeçalho ou arraste campos para inserir"
                                    error={!!form.formState.errors.header}
                                    className="min-h-[100px]"
                                    targetField="header"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Main content section and fields sidebar */}
                        <div className="lg:col-span-8">
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
                                    onDrop={handleEditorDrop}
                                    targetField="content"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Integrated field creation panel */}
                        <div className="lg:col-span-4">
                          <FieldCreationPanel
                            fields={formFields}
                            onAddField={handleAddField}
                            onUpdateField={handleUpdateField}
                            onRemoveField={remove}
                            onAddPredefinedFields={handleAddPredefinedFields}
                            onFieldDragStart={handleFieldDragStart}
                            onFieldClick={handleFieldClick}
                            existingFieldKeys={getCurrentFieldKeys()}
                            selectedTargetField={selectedTemplateType}
                            onChangeTargetField={setSelectedTemplateType}
                            showPredefinedFields={showPredefinedFields}
                            togglePredefinedFields={togglePredefinedFields}
                          />
                        </div>

                        {/* Footer section */}
                        <div className="lg:col-span-12">
                          <FormField
                            control={form.control}
                            name="footer"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rodapé do Documento</FormLabel>
                                <FormControl>
                                  <WysiwygEditor
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    placeholder="Digite o rodapé ou arraste campos para inserir"
                                    error={!!form.formState.errors.footer}
                                    className="min-h-[100px]"
                                    targetField="footer"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
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
                        <div className="border rounded-md p-6 bg-white space-y-4">
                          {previewHeader && (
                            <div className="border-b pb-4 mb-4">
                              <div className="text-sm font-semibold text-muted-foreground mb-2">Cabeçalho:</div>
                              <div dangerouslySetInnerHTML={{ __html: previewHeader }} />
                            </div>
                          )}
                          
                          <div className="min-h-[200px]">
                            <div className="text-sm font-semibold text-muted-foreground mb-2">Conteúdo:</div>
                            <div dangerouslySetInnerHTML={{ __html: previewContent }} />
                          </div>
                          
                          {previewFooter && (
                            <div className="border-t pt-4 mt-4">
                              <div className="text-sm font-semibold text-muted-foreground mb-2">Rodapé:</div>
                              <div dangerouslySetInnerHTML={{ __html: previewFooter }} />
                            </div>
                          )}
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
  );
}
