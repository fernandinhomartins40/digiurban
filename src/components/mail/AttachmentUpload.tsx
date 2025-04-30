
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMail } from "@/hooks/use-mail";
import { Paperclip } from "lucide-react";
import { useRef } from "react";

interface AttachmentUploadProps {
  documentId: string;
  onUploadComplete?: () => void;
}

export function AttachmentUpload({ documentId, onUploadComplete }: AttachmentUploadProps) {
  const { uploadAttachment, isLoadingUpload } = useMail();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      await uploadAttachment({ file, documentId });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (onUploadComplete) {
        onUploadComplete();
      }
    }
  };
  
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div>
      <Input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button 
        type="button" 
        variant="outline" 
        className="w-full" 
        onClick={handleClick}
        disabled={isLoadingUpload}
      >
        <Paperclip className="mr-2 h-4 w-4" />
        {isLoadingUpload ? "Carregando arquivo..." : "Anexar Arquivo"}
      </Button>
    </div>
  );
}
