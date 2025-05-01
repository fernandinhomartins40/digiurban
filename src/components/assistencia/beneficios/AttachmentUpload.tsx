
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getBenefitAttachments, uploadBenefitAttachment } from "@/services/assistance";
import { BenefitAttachment } from "@/types/assistance";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth/useAuth";

interface AttachmentUploadProps {
  benefitId: string;
}

export default function AttachmentUpload({ benefitId }: AttachmentUploadProps) {
  const [attachments, setAttachments] = useState<BenefitAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchAttachments();
  }, [benefitId]);

  const fetchAttachments = async () => {
    try {
      const data = await getBenefitAttachments(benefitId);
      setAttachments(data);
    } catch (error) {
      console.error("Error fetching attachments:", error);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar autenticado para fazer upload",
          variant: "destructive",
        });
        return;
      }

      setUploading(true);
      setProgress(10);
      
      try {
        for (let i = 0; i < acceptedFiles.length; i++) {
          const file = acceptedFiles[i];
          setProgress(Math.round((i / acceptedFiles.length) * 50) + 10);
          
          await uploadBenefitAttachment(benefitId, file, user.id);
          setProgress(Math.round((i + 1) / acceptedFiles.length * 90));
        }
        
        toast({
          title: "Sucesso",
          description: "Arquivos enviados com sucesso",
        });
        
        await fetchAttachments();
      } catch (error) {
        console.error("Error uploading file:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao enviar os arquivos",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-md p-6 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <p className="text-center text-sm">
            Arraste e solte arquivos aqui, ou clique para selecionar
          </p>
          <p className="text-xs text-gray-500">
            Máximo de 5 arquivos, até 10MB cada
          </p>
        </div>
      </div>

      {uploading && (
        <div className="space-y-2">
          <p className="text-sm">Enviando arquivos...</p>
          <Progress value={progress} />
        </div>
      )}

      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Arquivos anexados</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {attachments.map((attachment) => (
              <Card key={attachment.id}>
                <CardHeader className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <CardTitle className="text-sm">{attachment.file_name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="p-3 pt-0 flex justify-between">
                  <Badge variant="secondary">{formatBytes(attachment.file_size)}</Badge>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <a 
                      href={`${process.env.SUPABASE_URL}/storage/v1/object/public/tfd_documents/${attachment.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-full w-full items-center justify-center"
                    >
                      <FileText className="h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
