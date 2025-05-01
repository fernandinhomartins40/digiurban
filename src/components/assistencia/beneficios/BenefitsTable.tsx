
import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmergencyBenefit } from "@/types/assistance";
import { Eye, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface BenefitsTableProps {
  benefits: EmergencyBenefit[];
  loading: boolean;
  onView: (benefit: EmergencyBenefit) => void;
  onEdit: (benefit: EmergencyBenefit) => void;
}

const BenefitStatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; variant: string }> = {
    pending: { label: "Pendente", variant: "bg-yellow-100 text-yellow-800" },
    approved: { label: "Aprovado", variant: "bg-green-100 text-green-800" },
    delivering: { label: "Em Entrega", variant: "bg-blue-100 text-blue-800" },
    completed: { label: "Concluído", variant: "bg-slate-100 text-slate-800" },
    rejected: { label: "Rejeitado", variant: "bg-red-100 text-red-800" },
  };

  const { label, variant } = statusMap[status] || {
    label: status,
    variant: "bg-slate-100 text-slate-800",
  };

  return <Badge className={variant}>{label}</Badge>;
};

export default function BenefitsTable({
  benefits,
  loading,
  onView,
  onEdit,
}: BenefitsTableProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Protocolo</TableHead>
          <TableHead>Data da Solicitação</TableHead>
          <TableHead>Tipo do Benefício</TableHead>
          <TableHead>Motivo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {benefits.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10 text-gray-500">
              Nenhum benefício encontrado.
            </TableCell>
          </TableRow>
        ) : (
          benefits.map((benefit) => (
            <TableRow key={benefit.id}>
              <TableCell className="font-medium">{benefit.protocol_number}</TableCell>
              <TableCell>
                {format(new Date(benefit.request_date), "dd/MM/yyyy")}
              </TableCell>
              <TableCell>{benefit.benefit_type}</TableCell>
              <TableCell>
                {benefit.reason.length > 30
                  ? `${benefit.reason.substring(0, 30)}...`
                  : benefit.reason}
              </TableCell>
              <TableCell>
                <BenefitStatusBadge status={benefit.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(benefit)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(benefit)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
