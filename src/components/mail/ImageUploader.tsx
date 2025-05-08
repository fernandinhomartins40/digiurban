
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  children: React.ReactNode;
  onImageUploaded: (imageUrl: string) => void;
}

export function ImageUploader({ children, onImageUploaded }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;
    
    // Validate file type
    const fileType = selectedFile.type;
    if (!fileType.startsWith('image/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione um arquivo de imagem.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB.",
        variant: "destructive"
      });
      return;
    }
    
    setFile(selectedFile);
    
    // Create a preview URL
    const objectUrl = URL.createObjectURL(selectedFile);
    setImageUrl(objectUrl);
  };

  const handleUpload = () => {
    if (!file) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione uma imagem para upload.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // In a real implementation, we would upload the file to a server
    // For this prototype, we'll simulate a successful upload after a delay
    setTimeout(() => {
      // Using the object URL as the "uploaded" image URL
      // In a real app, this would be the URL returned from the server
      onImageUploaded(imageUrl);
      
      setIsUploading(false);
      setIsOpen(false);
      
      toast({
        title: "Imagem inserida",
        description: "A imagem foi inserida no cabeçalho com sucesso."
      });
      
      // Reset state for next upload
      setFile(null);
      setImageUrl('');
    }, 1000);
  };

  const handleInsertByUrl = () => {
    if (!imageUrl) {
      toast({
        title: "URL não informada",
        description: "Por favor, informe a URL da imagem.",
        variant: "destructive"
      });
      return;
    }

    onImageUploaded(imageUrl);
    setIsOpen(false);
    
    toast({
      title: "Imagem inserida",
      description: "A imagem foi inserida no cabeçalho com sucesso."
    });
    
    // Reset state for next upload
    setFile(null);
    setImageUrl('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Imagem</DialogTitle>
          <DialogDescription>
            Faça upload de uma imagem ou insira a URL de uma imagem existente.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Fazer upload de arquivo</Label>
            <Input 
              id="file-upload" 
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          
          <div className="border-t my-2"></div>
          
          <div className="space-y-2">
            <Label htmlFor="image-url">Ou inserir URL da imagem</Label>
            <Input 
              id="image-url" 
              placeholder="https://exemplo.com/imagem.jpg" 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          
          {imageUrl && !file && (
            <div className="flex justify-center p-2 border rounded-md">
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="max-h-40 max-w-full object-contain"
                onError={() => {
                  toast({
                    title: "Erro ao carregar imagem",
                    description: "Não foi possível carregar a imagem da URL fornecida.",
                    variant: "destructive"
                  });
                  setImageUrl('');
                }}
              />
            </div>
          )}
          
          {file && (
            <div className="flex justify-center p-2 border rounded-md">
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="max-h-40 max-w-full object-contain" 
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </Button>
          {file ? (
            <Button 
              type="button" 
              disabled={isUploading} 
              onClick={handleUpload}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inserindo...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Inserir Imagem
                </>
              )}
            </Button>
          ) : (
            <Button 
              type="button" 
              disabled={!imageUrl} 
              onClick={handleInsertByUrl}
            >
              Inserir por URL
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
