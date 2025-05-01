
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { getBenefitAttachments, createBenefitAttachment, deleteBenefitAttachment } from '@/services/assistance';
import { BenefitAttachment } from '@/types/assistance';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AttachmentUploadProps {
  benefitId: string;
  userId: string;
}

export default function AttachmentUpload({ benefitId, userId }: AttachmentUploadProps) {
  const [attachments, setAttachments] = useState<BenefitAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAttachments();
  }, [benefitId]);

  const fetchAttachments = async () => {
    try {
      const data = await getBenefitAttachments(benefitId);
      setAttachments(data);
    } catch (error) {
      console.error('Error fetching attachments:', error);
      toast({
        title: 'Erro ao carregar anexos',
        description: 'Não foi possível carregar os anexos deste benefício.',
        variant: 'destructive',
      });
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    try {
      for (const file of acceptedFiles) {
        // Upload file to Supabase Storage
        const filePath = `benefits/${benefitId}/${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('assistance_documents')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        // Create attachment record in the database
        await createBenefitAttachment({
          benefit_id: benefitId,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: userId,
        });
      }

      toast({
        title: 'Upload concluído',
        description: 'Os arquivos foram enviados com sucesso.',
      });

      // Refresh attachments list
      fetchAttachments();
    } catch (error) {
      console.error('Error uploading attachment:', error);
      toast({
        title: 'Erro ao fazer upload',
        description: 'Não foi possível enviar os arquivos.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  }, [benefitId, userId, toast]);

  const handleDelete = async (attachmentId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('assistance_documents')
        .remove([filePath]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
      }

      // Delete from database
      await deleteBenefitAttachment(attachmentId);

      toast({
        title: 'Anexo excluído',
        description: 'O anexo foi excluído com sucesso.',
      });

      // Refresh attachments list
      fetchAttachments();
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast({
        title: 'Erro ao excluir anexo',
        description: 'Não foi possível excluir o anexo.',
        variant: 'destructive',
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-6 rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <p className="text-sm">Enviando...</p>
        ) : isDragActive ? (
          <p className="text-sm">Solte os arquivos aqui...</p>
        ) : (
          <div>
            <p className="text-sm">Arraste e solte os arquivos aqui, ou clique para selecionar</p>
            <p className="text-xs text-muted-foreground mt-1">
              Documentos, imagens e PDFs (máximo 5MB por arquivo)
            </p>
          </div>
        )}
      </div>

      {attachments.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Anexos</h3>
          <div className="rounded-md border">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 border-b last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1 truncate">
                    <p className="text-sm font-medium truncate">{attachment.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(attachment.file_size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(attachment.id, attachment.file_path)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Excluir</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}
