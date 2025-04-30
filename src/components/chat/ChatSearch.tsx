
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ChatSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export function ChatSearch({ searchQuery, setSearchQuery }: ChatSearchProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar conversas..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}
