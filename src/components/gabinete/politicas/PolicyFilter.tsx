
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PolicyStatus } from "@/types/mayorOffice";

interface PolicyFilterProps {
  selectedStatus: PolicyStatus | "all";
  searchQuery: string;
  onStatusChange: (status: PolicyStatus | "all") => void;
  onSearchChange: (query: string) => void;
}

export function PolicyFilter({ 
  selectedStatus, 
  searchQuery, 
  onStatusChange, 
  onSearchChange 
}: PolicyFilterProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h3 className="text-lg font-medium">Políticas Públicas</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie e acompanhe as políticas públicas municipais
        </p>
      </div>
      <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8 w-full md:w-[250px]"
            placeholder="Buscar política..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export function PolicyTabs({ 
  selectedStatus, 
  onStatusChange 
}: {
  selectedStatus: PolicyStatus | "all";
  onStatusChange: (status: PolicyStatus | "all") => void;
}) {
  return (
    <Tabs
      value={selectedStatus}
      onValueChange={(value) => onStatusChange(value as PolicyStatus | "all")}
      className="w-full"
    >
      <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 gap-2">
        <TabsTrigger value="all">Todas</TabsTrigger>
        <TabsTrigger value="active">Ativas</TabsTrigger>
        <TabsTrigger value="draft">Rascunhos</TabsTrigger>
        <TabsTrigger value="completed">Concluídas</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
