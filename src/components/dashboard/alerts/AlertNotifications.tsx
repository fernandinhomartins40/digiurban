
import React from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

interface Alert {
  id: number;
  title: string;
  type: "info" | "warning" | "success" | "error" | "urgent";
  time: string;
}

interface AlertNotificationsProps {
  limit?: number;
}

export const AlertNotifications: React.FC<AlertNotificationsProps> = ({ limit = 5 }) => {
  // Simulated data for now
  const alerts: Alert[] = [
    {
      id: 1,
      title: "Prazo de licitação da reforma escolar se aproximando",
      type: "warning",
      time: "5 minutos atrás",
    },
    {
      id: 2,
      title: "Relatório mensal de saúde disponível para revisão",
      type: "info",
      time: "2 horas atrás",
    },
    {
      id: 3,
      title: "Aprovação de orçamento para o programa de assistência social",
      type: "success",
      time: "5 horas atrás",
    },
    {
      id: 4,
      title: "Reclamação sobre atendimento no posto de saúde central",
      type: "error",
      time: "1 dia atrás",
    },
    {
      id: 5,
      title: "Solicitação urgente de manutenção da rede de água",
      type: "urgent",
      time: "2 dias atrás",
    },
    {
      id: 6,
      title: "Novo evento municipal agendado para o próximo mês",
      type: "info",
      time: "2 dias atrás",
    },
  ];

  // Apply limit to alerts
  const displayAlerts = limit ? alerts.slice(0, limit) : alerts;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {displayAlerts.length > 0 ? (
        displayAlerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start space-x-4 rounded-lg border p-4 transition-all hover:bg-accent"
          >
            <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
            <div className="space-y-1">
              <p className="font-medium leading-none">{alert.title}</p>
              <p className="text-sm text-muted-foreground">{alert.time}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>Não há alertas recentes.</p>
        </div>
      )}
    </div>
  );
};
