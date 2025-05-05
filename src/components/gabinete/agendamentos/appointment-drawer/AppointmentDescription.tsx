
import React from "react";
import { FileText } from "lucide-react";
import { Appointment } from "@/types/mayorOffice";

interface AppointmentDescriptionProps {
  appointment: Appointment;
}

export function AppointmentDescription({ appointment }: AppointmentDescriptionProps) {
  if (!appointment.description) return null;
  
  return (
    <div>
      <h4 className="text-sm font-medium mb-1">Descrição</h4>
      <div className="text-sm border rounded-md p-3 bg-muted/30">
        <div className="flex gap-2">
          <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p>{appointment.description}</p>
        </div>
      </div>
    </div>
  );
}
