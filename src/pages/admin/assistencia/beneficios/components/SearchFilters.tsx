
import React from 'react';
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterChange: (value: string) => void;
  typeOptions: string[];
}

export function SearchFilters({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  typeOptions
}: SearchFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative w-full md:w-auto flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, protocolo..."
          className="pl-8 w-full"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={filterType} onValueChange={onFilterChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>{filterType || "Filtrar tipo"}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos os tipos</SelectItem>
          {typeOptions.map((type) => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
