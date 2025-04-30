
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgramStatus } from "@/types/mayorOffice";

interface ProgramFilterProps {
  selectedStatus: ProgramStatus | "all";
  searchQuery: string;
  onStatusChange: (status: ProgramStatus | "all") => void;
  onSearchChange: (query: string) => void;
}

export function ProgramFilter({ 
  selectedStatus, 
  searchQuery, 
  onStatusChange, 
  onSearchChange 
}: ProgramFilterProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h3 className="text-lg font-medium">Programas Estratégicos</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie e acompanhe os programas prioritários da gestão
        </p>
      </div>
      <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8 w-full md:w-[250px]"
            placeholder="Buscar programa..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export function ProgramTabs({ 
  selectedStatus, 
  onStatusChange 
}: {
  selectedStatus: ProgramStatus | "all";
  onStatusChange: (status: ProgramStatus | "all") => void;
}) {
  return (
    <Tabs
      value={selectedStatus}
      onValueChange={(value) => onStatusChange(value as ProgramStatus | "all")}
      className="w-full"
    >
      <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 gap-2">
        <TabsTrigger value="all">Todos</TabsTrigger>
        <TabsTrigger value="planning">Planejamento</TabsTrigger>
        <TabsTrigger value="in_progress">Em Andamento</TabsTrigger>
        <TabsTrigger value="completed">Concluídos</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
