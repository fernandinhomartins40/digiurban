
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UnifiedRequest } from "@/types/requests";
import { getStatusName } from "@/utils/requestMappers";
import { Clock, AlertCircle } from "lucide-react";

interface RequestStatusHistoryProps {
  request: UnifiedRequest;
}

export function RequestStatusHistory({ request }: RequestStatusHistoryProps) {
  const formatDate = (date: Date) => {
    try {
      return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };
  
  // Add creation event to history
  const events = [
    {
      date: request.createdAt,
      title: "Solicitação criada",
      description: `Solicitação aberta com status "${getStatusName('open')}"`,
      person: request.requesterName || "Sistema"
    },
    ...(request.statusHistory || []).map(history => ({
      date: history.createdAt,
      title: `Status alterado para "${getStatusName(history.newStatus)}"`,
      description: history.comments || "",
      person: history.changedByName || "Sistema"
    })),
    ...(request.completedAt ? [{
      date: request.completedAt,
      title: "Solicitação concluída",
      description: "",
      person: "Sistema"
    }] : [])
  ].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return (
    <div className="py-4 space-y-4">
      <h3 className="font-medium text-lg mb-2">Histórico de Status</h3>
      
      {events.length > 0 ? (
        <div className="relative border-l-2 border-muted pl-6 ml-2 space-y-8">
          {events.map((event, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[29px] bg-background border-2 border-muted p-1 rounded-full">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              
              <div>
                <p className="text-sm font-medium">{event.title}</p>
                <time className="text-xs text-muted-foreground">
                  {formatDate(event.date)} • {event.person}
                </time>
                {event.description && (
                  <p className="mt-2 text-sm">{event.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p>Nenhuma mudança de status registrada ainda.</p>
        </div>
      )}
    </div>
  );
}
