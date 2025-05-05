
import React from "react";
import { AppointmentStatus } from "@/types/mayorOffice";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface AppointmentFiltersProps {
  filterStatus: AppointmentStatus | "all";
  setFilterStatus: (status: AppointmentStatus | "all") => void;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

export function AppointmentFilters({ 
  filterStatus, 
  setFilterStatus,
  searchTerm = "",
  setSearchTerm
}: AppointmentFiltersProps) {
  return (
    <div className="space-y-4">
      {setSearchTerm && (
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nome ou assunto..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      
      <div className="flex items-center">
        <span className="text-sm font-medium mr-2">Status:</span>
        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as AppointmentStatus | "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione um status" />
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
