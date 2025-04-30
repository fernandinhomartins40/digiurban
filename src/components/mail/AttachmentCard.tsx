
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DocumentAttachment } from "@/types/mail";
import { formatFileSize } from "@/lib/utils";
import { FileText, Download } from "lucide-react";
import { useMail } from "@/hooks/use-mail";
import { useState } from "react";

interface AttachmentCardProps {
  attachment: DocumentAttachment;
}

export function AttachmentCard({ attachment }: AttachmentCardProps) {
  const { getAttachmentUrl } = useMail();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const url = await getAttachmentUrl(attachment.file_path);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading attachment:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="p-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <FileText size={24} className="text-primary" />
        <div>
          <p className="font-medium text-sm">{attachment.file_name}</p>
          <p className="text-xs text-muted-foreground">{formatFileSize(attachment.file_size)}</p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleDownload} 
        disabled={isLoading}
      >
        <Download size={16} />
      </Button>
    </Card>
  );
}
