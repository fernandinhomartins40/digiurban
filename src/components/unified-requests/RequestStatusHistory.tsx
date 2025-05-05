
import React from "react";
import { UnifiedRequest } from "@/types/requests";
import { mapStatusName } from "@/utils/requestMappers";
import { Clock, AlertCircle } from "lucide-react";
import { formatDate, toDate } from "@/utils/dateUtils"; 

interface RequestStatusHistoryProps {
  request: UnifiedRequest;
}

export function RequestStatusHistory({ request }: RequestStatusHistoryProps) {
  // Add creation event to history
  const events = [
    {
      date: request.created_at,
      title: "Solicitação criada",
      description: `Solicitação aberta com status "${mapStatusName('open')}"`,
      person: request.requester_name || "Sistema"
    },
    ...(request.status_history || []).map(history => ({
      date: history.created_at,
      title: `Status alterado para "${mapStatusName(history.new_status)}"`,
      description: history.comments || "",
      person: history.changed_by_name || "Sistema"
    })),
    ...(request.completed_at ? [{
      date: request.completed_at,
      title: "Solicitação concluída",
      description: "",
      person: "Sistema"
    }] : [])
  ].sort((a, b) => {
    // Safely convert to timestamps for comparison
    const dateA = toDate(a.date);
    const dateB = toDate(b.date);
    
    if (!dateA && !dateB) return 0;
    if (!dateA) return -1;
    if (!dateB) return 1;
    
    return dateA.getTime() - dateB.getTime();
  });
  
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
                  {formatDate(event.date, "dd/MM/yyyy HH:mm")} • {event.person}
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
