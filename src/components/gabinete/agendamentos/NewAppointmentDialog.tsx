
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NewAppointmentDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

export function NewAppointmentDialog({ 
  open, 
  onOpenChange, 
  onSuccess,
  buttonVariant = "default",
  className = ""
}: NewAppointmentDialogProps) {
  return (
    <Button 
      onClick={() => onOpenChange?.(true)}
      variant={buttonVariant as any}
      className={className}
    >
      <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
    </Button>
  );
}
