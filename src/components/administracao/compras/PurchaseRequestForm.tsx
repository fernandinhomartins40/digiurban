
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SendHorizonal } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth/useAuth";
import { createPurchaseRequest } from "@/services/administration/purchase/requests";
import { uploadPurchaseAttachment } from "@/services/administration/purchase/attachments";
import { toast } from "@/hooks/use-toast";
import { purchaseFormSchema, defaultFormValues, PurchaseFormValues } from "./utils/formUtils";
import { PurchaseFormHeader } from "./components/PurchaseFormHeader";
import { PurchaseItemsList } from "./components/PurchaseItemsList";
import { AttachmentField } from "./components/AttachmentField";

interface PurchaseRequestFormProps {
  onRequestCreated: () => void;
  departmentsList: string[];
}

export function PurchaseRequestForm({ onRequestCreated, departmentsList }: PurchaseRequestFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: defaultFormValues,
  });

  // Submit form
  const handleSubmit = async (values: PurchaseFormValues) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Create purchase request
      const request = await createPurchaseRequest(
        user.id,
        values.department,
        values.justification,
        values.priority,
        values.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          description: item.description,
          estimatedPrice: item.estimatedPrice,
        }))
      );

      if (!request) {
        throw new Error("Erro ao criar solicitação de compra");
      }

      // Upload attachments if any
      if (files.length > 0) {
        for (const file of files) {
          await uploadPurchaseAttachment(user.id, request.id, file);
        }
      }

      toast({
        title: "Solicitação enviada",
        description: `Solicitação de compra ${request.protocolNumber} enviada com sucesso.`,
      });

      // Reset form and state
      form.reset();
      setFiles([]);
      onRequestCreated();

    } catch (error: unknown) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar solicitação de compra",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white space-y-4">
      <h3 className="text-lg font-medium mb-4">Nova Solicitação de Compra</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <PurchaseFormHeader 
            control={form.control} 
            departmentsList={departmentsList} 
          />
          
          <PurchaseItemsList 
            form={form} 
            control={form.control} 
          />

          <AttachmentField 
            files={files} 
            setFiles={setFiles} 
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <SendHorizonal className="mr-2 h-4 w-4" />
                Enviar Solicitação de Compra
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
