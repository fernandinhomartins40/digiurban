
import React from "react";
import { NewAppointmentDrawer } from "./NewAppointmentDrawer";

interface NewAppointmentDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

export function NewAppointmentDialog({ 
  onSuccess,
  buttonVariant = "default",
  className = ""
}: NewAppointmentDialogProps) {
  return (
    <NewAppointmentDrawer
      onSuccess={onSuccess}
      buttonVariant={buttonVariant}
      className={className}
    />
  );
}
