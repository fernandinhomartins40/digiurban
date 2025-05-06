
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AppointmentStatus } from "@/types/mayorOffice";

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
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm && setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-4">
      <Select
        value={filterStatus}
        onValueChange={(value: string) => setFilterStatus(value as AppointmentStatus | "all")}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Status</SelectItem>
          <SelectItem value="pending">Pendente</SelectItem>
          <SelectItem value="approved">Aprovado</SelectItem>
          <SelectItem value="rejected">Rejeitado</SelectItem>
          <SelectItem value="completed">Concluído</SelectItem>
          <SelectItem value="cancelled">Cancelado</SelectItem>
        </SelectContent>
      </Select>
      
      {setSearchTerm && (
        <div className="flex w-full relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por nome ou assunto..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8"
              onClick={() => setSearchTerm("")}
            >
              Limpar
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
