
import React from "react";
import { Search } from "lucide-react";
import { AppointmentStatus } from "@/types/mayorOffice";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface AppointmentFiltersProps {
  filterStatus: AppointmentStatus | "all";
  setFilterStatus: (status: AppointmentStatus | "all") => void;
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
}

export function AppointmentFilters({
  filterStatus,
  setFilterStatus,
  searchTerm = "",
  setSearchTerm
}: AppointmentFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar agendamentos..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm?.(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full sm:w-[180px]">
        <Select
          value={filterStatus}
          onValueChange={(value) => setFilterStatus(value as AppointmentStatus | "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="approved">Aprovados</SelectItem>
            <SelectItem value="rejected">Rejeitados</SelectItem>
            <SelectItem value="completed">Concluídos</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
