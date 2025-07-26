
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Upload } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { DocumentType } from "@/types/administration";
import { uploadDocumentFile, createDocument } from "@/services/administration/hrDocumentsService";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth/useAuth";

const formSchema = z.object({
  documentType: z.string().min(1, "É necessário selecionar um tipo de documento"),
  observations: z.string().optional(),
  file: z.instanceof(File).refine(file => file.size < 20 * 1024 * 1024, {
    message: "O arquivo deve ter menos de 20MB",
  }),
});

interface DocumentUploadProps {
  documentTypes: DocumentType[];
  onUploadComplete: () => void;
}

export function DocumentUpload({ documentTypes, onUploadComplete }: DocumentUploadProps) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      observations: "",
    },
  });

  const fileRef = React.useRef<HTMLInputElement>(null);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Upload file to storage
      const uploadResult = await uploadDocumentFile(user.id, values.file);

      if (!uploadResult) {
        throw new Error("Falha ao fazer upload do arquivo");
      }

      // Create document record
      const document = await createDocument(
        user.id,
        values.documentType,
        uploadResult.path,
        values.file.name,
        values.file.type,
        uploadResult.size,
        values.observations || null
      );

      if (!document) {
        throw new Error("Falha ao registrar documento");
      }

      toast({
        title: "Sucesso",
        description: "Documento enviado com sucesso",
      });

      form.reset();
      if (fileRef.current) {
        fileRef.current.value = "";
      }
      onUploadComplete();
    } catch (error: unknown) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao enviar documento",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("file", file, { shouldValidate: true });
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-medium mb-4">Envio de Documentos</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="documentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Documento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de documento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {documentTypes.map((type) => (
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
            name="file"
            render={() => (
              <FormItem>
                <FormLabel>Arquivo</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileRef}
                      onChange={handleFileChange}
                      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="observations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações (opcional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Informações adicionais sobre o documento" 
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Enviar Documento
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
