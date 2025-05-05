
import React from "react";
import { Badge } from "@/components/ui/badge";
import { PriorityLevel } from "@/types/mayorOffice";

interface PriorityBadgeProps {
  priority: PriorityLevel;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  switch (priority) {
    case "low":
      return <Badge variant="outline">Baixa prioridade</Badge>;
    case "normal":
      return <Badge variant="outline">Prioridade normal</Badge>;
    case "high":
      return <Badge variant="outline">Alta prioridade</Badge>;
    case "urgent":
      return <Badge variant="destructive">Prioridade urgente</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
}
