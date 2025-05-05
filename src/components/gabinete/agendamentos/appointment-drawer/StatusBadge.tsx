
import React from "react";
import { Badge } from "@/components/ui/badge";
import { AppointmentStatus } from "@/types/mayorOffice";

interface StatusBadgeProps {
  status: AppointmentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">Pendente</Badge>;
    case "approved":
      return <Badge variant="default">Aprovado</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejeitado</Badge>;
    case "completed":
      return <Badge variant="outline">Concluído</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelado</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
