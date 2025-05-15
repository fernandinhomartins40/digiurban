import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, SendHorizonal, Plus, X, FileText, Paperclip } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HRRequestType } from "@/types/administration";
import { useAuth } from "@/contexts/auth/useAuth";
import { createRequest, uploadRequestAttachment } from "@/services/administration/hr";
import { toast } from "@/hooks/use-toast";

const baseFormSchema = z.object({
  requestType: z.string().min(1, "É necessário selecionar um tipo de solicitação"),
});

interface RequestFormProps {
  requestTypes: HRRequestType[];
  onRequestCreated: () => void;
}

export function RequestForm({ requestTypes, onRequestCreated }: RequestFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState<HRRequestType | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  // Base form for selecting request type
  const baseForm = useForm<z.infer<typeof baseFormSchema>>({
    resolver: zodResolver(baseFormSchema),
    defaultValues: {
      requestType: "",
    },
  });

  // Dynamic form for request type fields
  const [dynamicFormSchema, setDynamicFormSchema] = useState<z.ZodObject<any>>(z.object({}));
  const dynamicForm = useForm<any>({
    resolver: zodResolver(dynamicFormSchema),
  });

  // Handle request type selection
  const onRequestTypeChange = (requestTypeId: string) => {
    const requestType = requestTypes.find((type) => type.id === requestTypeId);
    if (!requestType) return;

    setSelectedRequestType(requestType);

    // Build dynamic form schema based on fields from selected request type
    const schemaFields: { [key: string]: any } = {};
    requestType.formSchema.fields.forEach((field) => {
      let fieldSchema: any;
      
      if (field.type === 'date') {
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = fieldSchema.min(1, `${field.label} é obrigatório`);
        } else {
          fieldSchema = fieldSchema.optional();
        }
      } else if (field.type === 'number') {
        fieldSchema = z.string().transform((val) => parseInt(val, 10) || 0);
        if (field.required) {
          fieldSchema = z.string().min(1, `${field.label} é obrigatório`).transform((val) => parseInt(val, 10) || 0);
        }
      } else if (field.type === 'textarea' || field.type === 'text') {
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = fieldSchema.min(1, `${field.label} é obrigatório`);
        } else {
          fieldSchema = fieldSchema.optional();
        }
      } else {
        // Default to string
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = fieldSchema.min(1, `${field.label} é obrigatório`);
        } else {
          fieldSchema = fieldSchema.optional();
        }
      }

      schemaFields[field.name] = fieldSchema;
    });

    setDynamicFormSchema(z.object(schemaFields));
    dynamicForm.reset();
  };

  // Handle file selection
  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
    e.target.value = "";
  };

  // Remove file from list
  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (values: any) => {
    if (!user || !selectedRequestType) {
      toast({
        title: "Erro",
        description: "Dados incompletos para envio da solicitação",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Create request - fix: pass values as the third argument (formData)
      const response = await createRequest(
        user.id,
        selectedRequestType.id,
        values
      );

      if (!response || response.error || !response.data) {
        throw new Error("Erro ao criar solicitação");
      }

      // Upload attachments if any
      if (files.length > 0) {
        for (const file of files) {
          await uploadRequestAttachment(response.data.id, file);
        }
      }

      toast({
        title: "Solicitação enviada",
        description: `Solicitação ${response.data.protocolNumber} enviada com sucesso.`,
      });

      // Reset forms and state
      baseForm.reset();
      dynamicForm.reset();
      setSelectedRequestType(null);
      setFiles([]);
      onRequestCreated();

    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar solicitação",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white space-y-4">
      <h3 className="text-lg font-medium mb-4">Nova Solicitação</h3>

      {!selectedRequestType ? (
        <Form {...baseForm}>
          <form
            onSubmit={baseForm.handleSubmit((data) => onRequestTypeChange(data.requestType))}
            className="space-y-4"
          >
            <FormField
              control={baseForm.control}
              name="requestType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Solicitação</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de solicitação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {requestTypes.map((type) => (
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

            <Button type="submit">
              Continuar
            </Button>
          </form>
        </Form>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">{selectedRequestType.name}</h4>
            <Button variant="outline" size="sm" onClick={() => setSelectedRequestType(null)}>
              Voltar
            </Button>
          </div>

          <Form {...dynamicForm}>
            <form onSubmit={dynamicForm.handleSubmit(handleSubmit)} className="space-y-4">
              {selectedRequestType.formSchema.fields.map((field) => {
                switch (field.type) {
                  case "textarea":
                    return (
                      <FormField
                        key={field.name}
                        control={dynamicForm.control}
                        name={field.name}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel>{field.label}</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder={field.label}
                                className="resize-none"
                                {...formField}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  case "date":
                    return (
                      <FormField
                        key={field.name}
                        control={dynamicForm.control}
                        name={field.name}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel>{field.label}</FormLabel>
                            <FormControl>
                              <Input type="date" {...formField} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  case "number":
                    return (
                      <FormField
                        key={field.name}
                        control={dynamicForm.control}
                        name={field.name}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel>{field.label}</FormLabel>
                            <FormControl>
                              <Input type="number" {...formField} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  default: // text
                    return (
                      <FormField
                        key={field.name}
                        control={dynamicForm.control}
                        name={field.name}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel>{field.label}</FormLabel>
                            <FormControl>
                              <Input placeholder={field.label} {...formField} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                }
              })}

              {/* Document attachments section */}
              <div className="mt-4">
                <FormLabel>Documentos (opcional)</FormLabel>
                <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 mt-1">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-sm text-center text-gray-500 mb-2">
                      Anexe os documentos necessários diretamente à sua solicitação
                    </p>
                    <label className="flex flex-col items-center justify-center cursor-pointer">
                      <Paperclip className="h-6 w-6 text-gray-400" />
                      <span className="text-sm text-gray-500 mt-1">Adicionar documento</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileAdd}
                      />
                    </label>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">Documentos anexados:</p>
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between border rounded-md p-2"
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <div className="truncate">{file.name}</div>
                            <div className="text-xs text-gray-500">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleFileRemove(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <SendHorizonal className="mr-2 h-4 w-4" />
                    Enviar Solicitação
                  </>
                )}
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}
