
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProgramFilterProps {
  searchQuery: string;
  category: string;
  status: string;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
}

export function ProgramFilter({
  searchQuery,
  category,
  status,
  onSearchChange,
  onCategoryChange,
  onStatusChange
}: ProgramFilterProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative w-full sm:w-[250px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar programa"
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Todas as categorias" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todas as categorias</SelectItem>
          <SelectItem value="hiperdia">Hiperdia</SelectItem>
          <SelectItem value="saude_mental">Saúde Mental</SelectItem>
          <SelectItem value="saude_mulher">Saúde da Mulher</SelectItem>
          <SelectItem value="tabagismo">Tabagismo</SelectItem>
          <SelectItem value="puericultura">Puericultura</SelectItem>
          <SelectItem value="gestantes">Gestantes</SelectItem>
          <SelectItem value="idosos">Idosos</SelectItem>
          <SelectItem value="nutricao">Nutrição</SelectItem>
          <SelectItem value="outros">Outros</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Ativos</SelectItem>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="inactive">Inativos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
