
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Template, TemplateField, DocumentType } from '@/types/mail';
import { FieldList } from '@/components/mail/FieldList';
import { FieldCreationPanel } from '@/components/mail/FieldCreationPanel';
import { WysiwygEditor } from '@/components/mail/WysiwygEditor';
import { useToast } from '@/hooks/use-toast';
import { getDocumentTypes, createTemplate, getTemplate, updateTemplate } from '@/services/mailService';
import { useNavigate, useParams } from 'react-router-dom';
import { generateFieldId, extractFieldsFromContent } from '@/utils/mailTemplateUtils';
import { useQuery } from '@tanstack/react-query';

// Form schema for template creation/editing
const templateFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  documentTypeId: z.string().optional(),
  content: z.string().optional().default(''),
  header: z.string().optional(),
  footer: z.string().optional(),
  departments: z.array(z.string()).optional().default([]),
  fields: z.array(
    z.object({
      field_key: z.string().min(1, 'Chave do campo é obrigatória'),
      field_label: z.string().min(1, 'Rótulo do campo é obrigatório'),
      field_type: z.string().min(1, 'Tipo do campo é obrigatório'),
      is_required: z.boolean().default(false),
      field_options: z.any().optional(),
      order_position: z.number().optional(),
    })
  ).optional().default([]),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

const TemplateCreator: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [selectedTemplateType, setSelectedTemplateType] = useState<'content' | 'header' | 'footer'>('content');
  const [showPredefinedFields, setShowPredefinedFields] = useState(false);
  
  const togglePredefinedFields = () => setShowPredefinedFields(!showPredefinedFields);
  
  // Setup form
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: '',
      description: '',
      documentTypeId: '',
      content: '',
      header: '',
      footer: '',
      departments: [],
      fields: [],
    }
  });

  // Setup field array for form fields
  const { fields: formFields, append, update, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });
  
  // Fetch document types
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const types = await getDocumentTypes();
        setDocumentTypes(types);
      } catch (error) {
        console.error('Error fetching document types:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os tipos de documento",
          variant: "destructive",
        });
      }
    };
    
    fetchDocumentTypes();
  }, [toast]);
  
  // Fetch template data if editing
  const { data: templateData, isLoading: isTemplateLoading } = useQuery({
    queryKey: ['template', id],
    queryFn: () => id ? getTemplate(id) : Promise.resolve(null),
    enabled: !!id,
  });
  
  // Populate form when template data is fetched
  useEffect(() => {
    if (templateData) {
      form.reset({
        name: templateData.name || '',
        description: templateData.description || '',
        documentTypeId: templateData.document_type_id || '',
        content: templateData.content || '',
        header: templateData.header || '',
        footer: templateData.footer || '',
        departments: templateData.departments || [],
        fields: templateData.fields?.map(field => ({
          field_key: field.field_key,
          field_label: field.field_label,
          field_type: field.field_type,
          is_required: field.is_required,
          field_options: field.field_options || null,
          order_position: field.order_position || 0,
        })) || [],
      });
    }
  }, [templateData, form]);
  
  // Handle form submission
  const onSubmit = async (values: TemplateFormValues) => {
    try {
      // Map form fields to TemplateField format
      const templateFields: Partial<TemplateField>[] = values.fields.map((field, index) => ({
        field_key: field.field_key,
        field_label: field.field_label,
        field_type: field.field_type,
        is_required: field.is_required,
        field_options: field.field_options,
        order_position: index,
      }));
      
      // Create or update template
      if (isEditing && id) {
        await updateTemplate(id, {
          name: values.name,
          description: values.description || null,
          document_type_id: values.documentTypeId || null,
          content: values.content || '',
          header: values.header || null,
          footer: values.footer || null,
          departments: values.departments || [],
        }, templateFields);
        
        toast({
          title: "Sucesso",
          description: "Modelo atualizado com sucesso",
        });
      } else {
        // For now, we'll use a hardcoded creator_id
        // In a real app, this would come from auth context
        const creatorId = "00000000-0000-0000-0000-000000000000";
        
        await createTemplate({
          name: values.name,
          description: values.description || null,
          document_type_id: values.documentTypeId || null,
          content: values.content || '',
          header: values.header || null,
          footer: values.footer || null,
          creator_id: creatorId,
          departments: values.departments || [],
          is_active: true,
        }, templateFields);
        
        toast({
          title: "Sucesso",
          description: "Modelo criado com sucesso",
        });
      }
      
      // Navigate back to template library
      navigate('/admin/correio/biblioteca-modelos');
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o modelo",
        variant: "destructive",
      });
    }
  };
  
  // Handle adding field
  const handleAddField = (field: Partial<TemplateField>) => {
    append({
      field_key: field.field_key || '',
      field_label: field.field_label || '',
      field_type: field.field_type || 'text',
      is_required: field.is_required || false,
      field_options: field.field_options,
      order_position: formFields.length,
    });
  };
  
  // Handle updating field
  const handleUpdateField = (index: number, field: Partial<TemplateField>) => {
    update(index, {
      field_key: field.field_key || '',
      field_label: field.field_label || '',
      field_type: field.field_type || 'text',
      is_required: field.is_required || false,
      field_options: field.field_options,
      order_position: field.order_position || index,
    });
  };
  
  // Handle adding predefined fields
  const handleAddPredefinedFields = (fields: Partial<TemplateField>[]) => {
    fields.forEach(field => {
      if (!formFields.some(existing => (existing as any).field_key === field.field_key)) {
        append({
          field_key: field.field_key || '',
          field_label: field.field_label || '',
          field_type: field.field_type || 'text',
          is_required: field.is_required || false,
          field_options: field.field_options,
          order_position: formFields.length,
        });
      }
    });
  };
  
  // Handle field drag start
  const handleFieldDragStart = (e: React.DragEvent, fieldKey: string, field?: Partial<TemplateField>) => {
    e.dataTransfer.setData('text/plain', `{{${fieldKey}}}`);
  };
  
  // Handle field click to insert at cursor
  const handleFieldClick = (fieldKey: string, targetField: string = 'content') => {
    const fieldText = `{{${fieldKey}}}`;
    
    // Create a custom event to notify the appropriate editor
    const event = new CustomEvent('insert-field', {
      detail: { fieldText, targetField },
    });
    
    document.dispatchEvent(event);
  };
  
  // Get current field keys for duplicate checking
  const getCurrentFieldKeys = () => {
    return formFields.map(field => (field as any).field_key);
  };
  
  // Extract fields from template content
  const extractTemplateFields = () => {
    const contentFields = extractFieldsFromContent(form.getValues('content') || '');
    const headerFields = extractFieldsFromContent(form.getValues('header') || '');
    const footerFields = extractFieldsFromContent(form.getValues('footer') || '');
    
    const allFields = [...new Set([...contentFields, ...headerFields, ...footerFields])];
    
    console.log('Extracted fields:', allFields);
  };

  return (
    <div className="container py-6 max-w-screen-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {isEditing ? 'Editar Modelo' : 'Criar Novo Modelo'}
        </h1>
        <p className="text-muted-foreground">
          {isEditing 
            ? 'Atualize os detalhes do modelo e seus campos' 
            : 'Crie um novo modelo para uso em documentos oficiais'}
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Modelo</CardTitle>
              <CardDescription>
                Informações básicas sobre o modelo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic template details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome do Modelo*</label>
                  <Input
                    {...form.register('name')}
                    placeholder="Nome do modelo"
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Documento</label>
                  <Select 
                    value={form.getValues('documentTypeId') || "none"} 
                    onValueChange={(value) => form.setValue('documentTypeId', value === "none" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {documentTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  {...form.register('description')}
                  placeholder="Descrição do modelo"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Departamentos</label>
                <Select 
                  value={form.getValues('departments')?.[0] || "none"} 
                  onValueChange={(value) => form.setValue('departments', value === "none" ? [] : [value])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    <SelectItem value="gabinete">Gabinete</SelectItem>
                    <SelectItem value="educacao">Educação</SelectItem>
                    <SelectItem value="saude">Saúde</SelectItem>
                    <SelectItem value="administracao">Administração</SelectItem>
                    <SelectItem value="financas">Finanças</SelectItem>
                    <SelectItem value="obras">Obras</SelectItem>
                    <SelectItem value="assistencia">Assistência Social</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Selecione o departamento para o qual este modelo será disponibilizado.
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <Tabs defaultValue="content">
                <TabsList className="mb-2">
                  <TabsTrigger value="content">Conteúdo</TabsTrigger>
                  <TabsTrigger value="header">Cabeçalho</TabsTrigger>
                  <TabsTrigger value="footer">Rodapé</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Conteúdo do Modelo</CardTitle>
                      <CardDescription>
                        Use o editor abaixo para criar o conteúdo do seu modelo. 
                        Insira os campos usando os botões ou arrastando-os para o editor.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <WysiwygEditor
                        value={form.getValues('content') || ''}
                        onChange={(value) => form.setValue('content', value)}
                        placeholder="Digite o conteúdo do modelo aqui..."
                        targetField="content"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="header" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cabeçalho do Modelo</CardTitle>
                      <CardDescription>
                        Crie o cabeçalho que será exibido em todos os documentos que usarem este modelo.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <WysiwygEditor
                        value={form.getValues('header') || ''}
                        onChange={(value) => form.setValue('header', value)}
                        placeholder="Digite o cabeçalho do modelo aqui..."
                        targetField="header"
                        height={200}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="footer" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Rodapé do Modelo</CardTitle>
                      <CardDescription>
                        Crie o rodapé que será exibido em todos os documentos que usarem este modelo.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <WysiwygEditor
                        value={form.getValues('footer') || ''}
                        onChange={(value) => form.setValue('footer', value)}
                        placeholder="Digite o rodapé do modelo aqui..."
                        targetField="footer"
                        height={200}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Field creation sidebar */}
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
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/correio/biblioteca-modelos')}
              >
                Cancelar
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={extractTemplateFields}
                >
                  Extrair Campos
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {isEditing ? 'Atualizar Modelo' : 'Criar Modelo'}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default TemplateCreator;
