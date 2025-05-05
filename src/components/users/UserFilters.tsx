
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

interface UserFiltersProps {
  onFilterChange: (filters: UserFilterValues) => void;
  departments: string[];
}

export interface UserFilterValues {
  searchTerm: string;
  department: string | null;
  role: string | null;
  status: string | null;
}

export function UserFilters({ onFilterChange, departments }: UserFiltersProps) {
  const [filters, setFilters] = useState<UserFilterValues>({
    searchTerm: "",
    department: null,
    role: null,
    status: null
  });

  const handleFilterChange = (key: keyof UserFilterValues, value: string | null) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, searchTerm: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const resetValues = {
      searchTerm: "",
      department: null,
      role: null,
      status: null
    };
    setFilters(resetValues);
    onFilterChange(resetValues);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou CPF..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
        
        <Select
          value={filters.department || ""}
          onValueChange={(value) => handleFilterChange('department', value || null)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os departamentos</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={filters.role || ""}
          onValueChange={(value) => handleFilterChange('role', value || null)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as funções</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="prefeito">Prefeito</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          <span>Filtros ativos</span>
        </div>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Limpar filtros
        </Button>
      </div>
    </div>
  );
}
