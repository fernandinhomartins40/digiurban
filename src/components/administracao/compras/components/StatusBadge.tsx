
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  CircleDashed,
} from "lucide-react";
import { PurchaseRequestStatus } from "@/services/administration/purchase";

interface StatusBadgeProps {
  status: PurchaseRequestStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <div className="flex items-center gap-1">
      {getStatusIcon(status)}
      {getStatusBadge(status)}
    </div>
  );
}

export function getStatusBadge(status: PurchaseRequestStatus) {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
    case "in_analysis":
      return <Badge variant="outline" className="bg-purple-100 text-purple-800">Em Análise</Badge>;
    case "approved":
      return <Badge variant="outline" className="bg-green-100 text-green-800">Aprovado</Badge>;
    case "in_process":
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Em Processo</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-slate-100 text-slate-800">Concluído</Badge>;
    case "rejected":
      return <Badge variant="outline" className="bg-red-100 text-red-800">Rejeitado</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
}

export function getStatusIcon(status: PurchaseRequestStatus) {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "in_analysis":
      return <CircleDashed className="h-4 w-4 text-purple-500" />;
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "in_process":
      return <CircleDashed className="h-4 w-4 text-blue-500" />;
    case "completed":
      return <CheckCircle className="h-4 w-4 text-slate-500" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
}
