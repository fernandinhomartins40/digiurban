
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface BenefitFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BenefitFormDialog({ open, onOpenChange }: BenefitFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Benefício Emergencial</DialogTitle>
          <DialogDescription>
            Registre um novo benefício emergencial para um cidadão.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-center text-muted-foreground">
            Formulário para cadastro de benefício será implementado aqui.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
