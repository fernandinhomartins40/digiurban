
import React from "react";
import { Button } from "@/components/ui/button";
import { Appointment, AppointmentStatus } from "@/types/mayorOffice";

interface AppointmentActionsProps {
  appointment: Appointment;
  onApprove?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  onComplete?: (id: string) => Promise<void>;
  onClose: () => void;
}

export function AppointmentActions({ 
  appointment, 
  onApprove, 
  onReject, 
  onComplete, 
  onClose 
}: AppointmentActionsProps) {
  if (appointment.status === "pending") {
    return (
      <>
        <Button
          variant="outline"
          onClick={() => onReject && onReject(appointment.id)}
        >
          Recusar
        </Button>
        <Button 
          onClick={() => onApprove && onApprove(appointment.id)}
        >
          Aprovar
        </Button>
      </>
    );
  }
  
  if (appointment.status === "approved") {
    return (
      <Button 
        onClick={() => onComplete && onComplete(appointment.id)}
      >
        Marcar como Concluído
      </Button>
    );
  }
  
  // For completed, rejected or cancelled status
  return <Button onClick={onClose}>Fechar</Button>;
}
