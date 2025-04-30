
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";

interface AttachmentFieldProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export function AttachmentField({ files, setFiles }: AttachmentFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
    e.target.value = "";
  };

  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-4">
      <FormLabel>Anexos (opcional)</FormLabel>
      <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 mt-1">
        <div className="flex flex-col items-center justify-center space-y-2">
          <label className="flex flex-col items-center justify-center cursor-pointer">
            <Plus className="h-6 w-6 text-gray-400" />
            <span className="text-sm text-gray-500 mt-1">Adicionar arquivo</span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileAdd}
              ref={fileInputRef}
            />
          </label>
        </div>
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between border rounded-md p-2"
              >
                <div className="flex items-center space-x-2 truncate">
                  <div className="truncate">{file.name}</div>
                  <div className="text-xs text-gray-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFileRemove(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
