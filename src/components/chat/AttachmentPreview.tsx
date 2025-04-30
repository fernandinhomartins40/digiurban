
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface AttachmentPreviewProps {
  file: File;
  onRemove: () => void;
}

export function AttachmentPreview({ file, onRemove }: AttachmentPreviewProps) {
  const isImage = file.type.startsWith("image/");
  
  return (
    <div className="relative group">
      {isImage ? (
        <div className="w-16 h-16 rounded overflow-hidden border">
          <img 
            src={URL.createObjectURL(file)} 
            alt={file.name}
            className="w-full h-full object-cover" 
          />
        </div>
      ) : (
        <div className="w-16 h-16 rounded overflow-hidden border flex items-center justify-center bg-muted/30 text-xs p-1 text-center">
          {file.name.split('.').pop()?.toUpperCase() || 'FILE'}
        </div>
      )}
      
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={10} />
      </button>
    </div>
  );
}
