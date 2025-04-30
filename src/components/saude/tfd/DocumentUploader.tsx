
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { uploadTFDDocument } from "@/services/health";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface DocumentUploaderProps {
  referralId: string;
  onUploadComplete: () => void;
}

export function DocumentUploader({ referralId, onUploadComplete }: DocumentUploaderProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !documentType || !user) {
      toast({
        title: "Erro",
        description: "Selecione um tipo de documento e um arquivo para upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      await uploadTFDDocument(referralId, documentType, file, user.id);
      toast({
        title: "Documento anexado",
        description: "O documento foi anexado com sucesso.",
      });
      setFile(null);
      setDocumentType("");
      onUploadComplete();
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Erro",
        description: "Não foi possível anexar o documento.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-4">
      <h4 className="font-medium mb-4">Anexar novo documento</h4>
      <div className="space-y-3">
        <Select value={documentType} onValueChange={setDocumentType}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de documento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="medical-report">Laudo médico</SelectItem>
            <SelectItem value="exam">Resultado de exame</SelectItem>
            <SelectItem value="authorization">Autorização</SelectItem>
            <SelectItem value="other">Outro</SelectItem>
          </SelectContent>
        </Select>

        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {file ? file.name : "Clique para selecionar um arquivo ou arraste e solte"}
          </p>
          {file && (
            <div className="mt-2 flex items-center justify-center">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                <X className="h-4 w-4 mr-1" /> Remover
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleUpload}
            disabled={!file || !documentType || uploading}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" /> Anexar Documento
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
