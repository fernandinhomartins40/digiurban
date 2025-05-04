
import React from "react";
import { 
  FileText, 
  Image, 
  FileArchive, 
  File, 
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

interface MessageAttachmentsProps {
  attachments: Attachment[];
}

export function MessageAttachments({ attachments }: MessageAttachmentsProps) {
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };
  
  // Get file icon based on type
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    } else if (type.startsWith('application/pdf')) {
      return <FileText className="h-4 w-4" />;
    } else if (type.includes('zip') || type.includes('compressed')) {
      return <FileArchive className="h-4 w-4" />;
    } else {
      return <File className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-2">
      {attachments.map(attachment => (
        <div 
          key={attachment.id}
          className="flex items-center gap-2 bg-background/20 rounded p-2 text-sm"
        >
          {getFileIcon(attachment.type)}
          <div className="flex-1 overflow-hidden">
            <p className="font-medium truncate">{attachment.name}</p>
            <p className="text-xs opacity-70">{formatFileSize(attachment.size)}</p>
          </div>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
