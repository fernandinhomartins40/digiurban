
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, PlusCircle } from "lucide-react";

interface MessageFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (key: string, value: string) => void;
  onNewMessage: () => void;
  filters: {
    messageType: string;
    recipientType: string;
  };
}

export function MessageFilters({
  onSearch,
  onFilterChange,
  onNewMessage,
  filters,
}: MessageFiltersProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm border mb-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow flex gap-2">
          <Input
            placeholder="Buscar mensagens..."
            className="w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button variant="outline" size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Select
            value={filters.messageType}
            onValueChange={(value) => onFilterChange("messageType", value)}
          >
            <SelectTrigger className="w-[160px]">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Tipo de mensagem" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="announcement">Comunicados</SelectItem>
              <SelectItem value="notice">Avisos</SelectItem>
              <SelectItem value="reminder">Lembretes</SelectItem>
              <SelectItem value="meeting">Reuniões</SelectItem>
              <SelectItem value="report">Relatórios</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.recipientType}
            onValueChange={(value) => onFilterChange("recipientType", value)}
          >
            <SelectTrigger className="w-[160px]">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Destinatários" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="parent">Pais</SelectItem>
              <SelectItem value="teacher">Professores</SelectItem>
              <SelectItem value="class">Turmas</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={onNewMessage}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova Mensagem
          </Button>
        </div>
      </div>
    </div>
  );
}
