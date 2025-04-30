
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
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useMail } from "@/hooks/use-mail";
import { DocumentDestination } from "@/types/mail";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  response: z.string().min(5, "A resposta é obrigatória e deve ter pelo menos 5 caracteres"),
});

interface ResponseDocumentDialogProps {
  destination: DocumentDestination;
  onComplete?: () => void;
}

export function ResponseDocumentDialog({ destination, onComplete }: ResponseDocumentDialogProps) {
  const { respondToDocument, isLoadingRespond } = useMail();
  const [open, setOpen] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      response: "",
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    respondToDocument({
      destinationId: destination.id,
      response: values.response,
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
        <Button size="sm" className="w-full">
          <MessageSquare size={16} className="mr-2" />
          Responder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Responder ao Documento</DialogTitle>
          <DialogDescription>
            Escreva sua resposta para este documento.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="response"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resposta</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite sua resposta aqui..." 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
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
                disabled={isLoadingRespond}
              >
                {isLoadingRespond && (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                )}
                Enviar Resposta
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
