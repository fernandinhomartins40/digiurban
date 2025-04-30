
import React from "react";
import { Badge } from "@/components/ui/badge";
import { PurchasePriority } from "@/services/administration/purchase";

interface PriorityBadgeProps {
  priority: PurchasePriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  switch (priority) {
    case "low":
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Baixa</Badge>;
    case "normal":
      return <Badge variant="outline" className="bg-green-100 text-green-800">Normal</Badge>;
    case "high":
      return <Badge variant="outline" className="bg-amber-100 text-amber-800">Alta</Badge>;
    case "urgent":
      return <Badge variant="outline" className="bg-red-100 text-red-800">Urgente</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
}
