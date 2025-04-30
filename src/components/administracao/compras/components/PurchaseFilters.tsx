
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PurchaseRequestStatus } from "@/services/administration/purchase";

interface PurchaseFiltersProps {
  statusFilter: PurchaseRequestStatus | "all";
  onStatusChange: (value: PurchaseRequestStatus | "all") => void;
  departmentFilter: string;
  onDepartmentChange: (value: string) => void;
  departments: string[];
  isAdmin: boolean;
}

export function PurchaseFilters({
  statusFilter,
  onStatusChange,
  departmentFilter,
  onDepartmentChange,
  departments,
  isAdmin
}: PurchaseFiltersProps) {
  if (!isAdmin) return null;

  return (
    <div className="flex items-center space-x-2">
      <Select
        value={statusFilter}
        onValueChange={(value: any) => onStatusChange(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pending">Pendentes</SelectItem>
          <SelectItem value="in_analysis">Em Análise</SelectItem>
          <SelectItem value="approved">Aprovados</SelectItem>
          <SelectItem value="in_process">Em Processo</SelectItem>
          <SelectItem value="completed">Concluídos</SelectItem>
          <SelectItem value="rejected">Rejeitados</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={departmentFilter}
        onValueChange={onDepartmentChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por departamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept} value={dept}>
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
