
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
import { VulnerableFamily } from "@/types/assistance";
import { Eye, Edit, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FamiliesTableProps {
  families: VulnerableFamily[];
  loading: boolean;
  onView: (family: VulnerableFamily) => void;
  onEdit: (family: VulnerableFamily) => void;
  onManageMembers: (family: VulnerableFamily) => void;
}

export default function FamiliesTable({
  families,
  loading,
  onView,
  onEdit,
  onManageMembers,
}: FamiliesTableProps) {
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

  const getFamilyStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      monitoring: {
        label: "Em Monitoramento",
        className: "bg-blue-100 text-blue-800",
      },
      stable: {
        label: "Estável",
        className: "bg-green-100 text-green-800",
      },
      critical: {
        label: "Crítico",
        className: "bg-red-100 text-red-800",
      },
      improved: {
        label: "Melhorado",
        className: "bg-purple-100 text-purple-800",
      },
      completed: {
        label: "Concluído",
        className: "bg-gray-100 text-gray-800",
      },
    };

    const status_info = statusMap[status] || {
      label: status,
      className: "bg-slate-100 text-slate-800",
    };

    return <Badge className={status_info.className}>{status_info.label}</Badge>;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome da Família</TableHead>
          <TableHead>Endereço</TableHead>
          <TableHead>Critérios de Vulnerabilidade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {families.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-10 text-gray-500">
              Nenhuma família cadastrada.
            </TableCell>
          </TableRow>
        ) : (
          families.map((family) => (
            <TableRow key={family.id}>
              <TableCell className="font-medium">{family.family_name}</TableCell>
              <TableCell>{`${family.address}, ${family.neighborhood}, ${family.city}-${family.state}`}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {family.vulnerability_criteria.map((criteria, index) => (
                    <Badge key={index} variant="outline">
                      {criteria}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{getFamilyStatusBadge(family.family_status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onManageMembers(family)}
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(family)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(family)}
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
