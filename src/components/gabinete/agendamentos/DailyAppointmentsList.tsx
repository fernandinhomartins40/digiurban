
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Appointment } from "@/types/mayorOffice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DailyAppointmentsListProps {
  date: Date;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
}

export function DailyAppointmentsList({
  date,
  appointments,
  onAppointmentClick
}: DailyAppointmentsListProps) {
  // Status badge colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprovado</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejeitado</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Concluído</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
    }
  };

  // Priority badge colors
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Alta</Badge>;
      case "urgent":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Urgente</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Baixa</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Normal</Badge>;
    }
  };

  // Sort appointments by time
  const sortedAppointments = [...appointments].sort((a, b) => {
    return a.requestedTime.localeCompare(b.requestedTime);
  });

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">
        Compromissos de {format(date, "dd 'de' MMMM", { locale: ptBR })}
      </h3>

      {sortedAppointments.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          Nenhum compromisso para esta data
        </p>
      ) : (
        <div className="space-y-3">
          {sortedAppointments.map((appointment) => (
            <Card key={appointment.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="border-l-4 p-4" style={{
                  borderLeftColor: appointment.status === "approved" ? "#10b981" : 
                                  appointment.status === "rejected" ? "#ef4444" :
                                  appointment.status === "completed" ? "#3b82f6" :
                                  appointment.status === "cancelled" ? "#6b7280" : "#f59e0b"
                }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{appointment.requestedTime}</div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(appointment.status)}
                      {getPriorityBadge(appointment.priority)}
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="font-semibold">{appointment.subject}</div>
                    <div className="text-sm text-muted-foreground">{appointment.requesterName}</div>
                  </div>

                  <div className="text-sm text-muted-foreground mb-2">
                    {appointment.description && appointment.description.length > 100 
                      ? `${appointment.description.substring(0, 100)}...` 
                      : appointment.description}
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onAppointmentClick(appointment)}
                    >
                      Ver detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
