
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
import { SocialProgram } from "@/types/assistance";
import { Eye, Edit, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProgramsTableProps {
  programs: SocialProgram[];
  loading: boolean;
  onView: (program: SocialProgram) => void;
  onEdit: (program: SocialProgram) => void;
  onManageBeneficiaries: (program: SocialProgram) => void;
}

export default function ProgramsTable({
  programs,
  loading,
  onView,
  onEdit,
  onManageBeneficiaries,
}: ProgramsTableProps) {
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

  const getScopeLabel = (scope: string) => {
    const scopeMap: Record<string, string> = {
      municipal: "Municipal",
      state: "Estadual",
      federal: "Federal",
    };
    return scopeMap[scope] || scope;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Esfera</TableHead>
          <TableHead>Início</TableHead>
          <TableHead>Término</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {programs.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10 text-gray-500">
              Nenhum programa social encontrado.
            </TableCell>
          </TableRow>
        ) : (
          programs.map((program) => (
            <TableRow key={program.id}>
              <TableCell className="font-medium">{program.name}</TableCell>
              <TableCell>{getScopeLabel(program.scope)}</TableCell>
              <TableCell>
                {program.start_date
                  ? format(new Date(program.start_date), "dd/MM/yyyy")
                  : "-"}
              </TableCell>
              <TableCell>
                {program.end_date
                  ? format(new Date(program.end_date), "dd/MM/yyyy")
                  : "-"}
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    program.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {program.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onManageBeneficiaries(program)}
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(program)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(program)}
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
