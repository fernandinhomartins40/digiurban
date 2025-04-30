
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMail } from "@/hooks/use-mail";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  toDepartment: z.string().min(3, "Departamento é obrigatório"),
});

interface ForwardDocumentDialogProps {
  documentId: string;
  onComplete?: () => void;
}

export function ForwardDocumentDialog({ documentId, onComplete }: ForwardDocumentDialogProps) {
  const { forwardDocument, isLoadingForward } = useMail();
  const [open, setOpen] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toDepartment: "",
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    forwardDocument({
      documentId,
      toDepartment: values.toDepartment,
    });
    
    setOpen(false);
    form.reset();
    
    if (onComplete) {
      onComplete();
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1">
          <Send size={16} className="mr-2" />
          Encaminhar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Encaminhar Documento</DialogTitle>
          <DialogDescription>
            Selecione o departamento para o qual deseja encaminhar este documento.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="toDepartment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento Destino</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Financeiro" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoadingForward}
              >
                {isLoadingForward && (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                )}
                Encaminhar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
