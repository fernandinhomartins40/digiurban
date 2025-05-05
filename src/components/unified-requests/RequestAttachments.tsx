
import React, { useState, useRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UnifiedRequest } from "@/types/requests";
import { Button } from "@/components/ui/button";
import { PaperclipIcon, Download, FileIcon, Loader2 } from "lucide-react";
import { filesize } from "filesize";
import { supabase } from "@/integrations/supabase/client";

interface RequestAttachmentsProps {
  request: UnifiedRequest;
  onUploadAttachment?: (id: string, file: File) => Promise<boolean>;
}

export function RequestAttachments({ 
  request, 
  onUploadAttachment 
}: RequestAttachmentsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !onUploadAttachment) return;
    
    setIsUploading(true);
    try {
      await onUploadAttachment(request.id, files[0]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const handleDownload = async (attachment: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('request-attachments')
        .download(attachment.file_path);
      
      if (error) throw error;
      
      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.file_name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  
  const formatDate = (date: Date) => {
    try {
      return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };
  
  const getFormattedFileSize = (size: number) => {
    // Convert to string explicitly to fix TypeScript error
    return String(filesize(size));
  };
  
  return (
    <div className="py-4 space-y-4">
      <h3 className="font-medium text-lg mb-2">Anexos</h3>
      
      {request.attachments && request.attachments.length > 0 ? (
        <div className="space-y-3">
          {request.attachments.map((attachment) => (
            <div 
              key={attachment.id} 
              className="flex items-center justify-between border rounded-md p-3"
            >
              <div className="flex items-center">
                <FileIcon className="h-8 w-8 text-muted-foreground mr-3" />
                <div>
                  <p className="font-medium text-sm">{attachment.file_name}</p>
                  <div className="flex text-xs text-muted-foreground">
                    <span>{getFormattedFileSize(attachment.file_size)}</span>
                    <span className="mx-1">•</span>
                    <span>{formatDate(attachment.uploaded_at)}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleDownload(attachment)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <PaperclipIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p>Nenhum arquivo anexado ainda.</p>
        </div>
      )}
      
      {onUploadAttachment && (
        <div className="mt-4">
          <input
            type="file"
            id="file-upload"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <PaperclipIcon className="mr-2 h-4 w-4" />
                Anexar Arquivo
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
