
import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Appointment } from "@/types/mayorOffice";

interface AppointmentDateTimeProps {
  appointment: Appointment;
}

export function AppointmentDateTime({ appointment }: AppointmentDateTimeProps) {
  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return date;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">
          <strong>Data:</strong> {formatDate(appointment.requestedDate.toString())}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">
          <strong>Horário:</strong> {appointment.requestedTime}
          {appointment.durationMinutes &&
            ` (${appointment.durationMinutes} minutos)`}
        </span>
      </div>
      {appointment.location && (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            <strong>Local:</strong> {appointment.location}
          </span>
        </div>
      )}
    </div>
  );
}
