
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

interface ChatFiltersProps {
  statusFilter: "all" | "active" | "closed";
  setStatusFilter: (value: "all" | "active" | "closed") => void;
}

export function ChatFilters({ statusFilter, setStatusFilter }: ChatFiltersProps) {
  return (
    <Select
      value={statusFilter}
      onValueChange={(value) => setStatusFilter(value as "all" | "active" | "closed")}
    >
      <SelectTrigger className="w-[180px]">
        <div className="flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Filtrar por status" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos</SelectItem>
        <SelectItem value="active">Ativos</SelectItem>
        <SelectItem value="closed">Encerrados</SelectItem>
      </SelectContent>
    </Select>
  );
}
