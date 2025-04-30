
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestStatus } from "@/types/mayorOffice";

interface RequestFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStatus: RequestStatus | "all";
  setSelectedStatus: (status: RequestStatus | "all") => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  departments: string[];
}

export function RequestFilter({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedDepartment,
  setSelectedDepartment,
  departments,
}: RequestFilterProps) {
  return (
    <div>
      <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8 w-full md:w-[200px] lg:w-[300px]"
            placeholder="Buscar solicitação..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filtrar por departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os departamentos</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs 
        defaultValue="all" 
        value={selectedStatus}
        onValueChange={(value) => setSelectedStatus(value as RequestStatus | "all")}
        className="w-full mt-4"
      >
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="open">Abertas</TabsTrigger>
          <TabsTrigger value="in_progress">Em Progresso</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
