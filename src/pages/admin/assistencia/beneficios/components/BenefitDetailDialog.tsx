
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BenefitDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BenefitDetailDialog({ open, onOpenChange }: BenefitDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Benefício</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-center text-muted-foreground">
            Detalhes do benefício serão exibidos aqui.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
