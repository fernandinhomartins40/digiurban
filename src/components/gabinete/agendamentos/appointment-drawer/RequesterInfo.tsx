
import React from "react";
import { User, Mail, Phone } from "lucide-react";
import { Appointment } from "@/types/mayorOffice";

interface RequesterInfoProps {
  appointment: Appointment;
}

export function RequesterInfo({ appointment }: RequesterInfoProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Dados do Solicitante</h4>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            <strong>Nome:</strong> {appointment.requesterName}
          </span>
        </div>
        {appointment.requesterEmail && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <strong>Email:</strong> {appointment.requesterEmail}
            </span>
          </div>
        )}
        {appointment.requesterPhone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <strong>Telefone:</strong> {appointment.requesterPhone}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
