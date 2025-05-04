
import React from "react";
import { Input } from "@/components/ui/input";
import { ProgramStatus } from "@/types/mayorOffice";
import { Button } from "@/components/ui/button";

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
  onSearchChange,
}: ProgramFilterProps) {
  return (
    <div>
      <Input
        placeholder="Buscar programas..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full md:w-72"
      />
    </div>
  );
}

interface ProgramTabsProps {
  selectedStatus: ProgramStatus | "all";
  onStatusChange: (status: ProgramStatus | "all") => void;
}

export function ProgramTabs({ selectedStatus, onStatusChange }: ProgramTabsProps) {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant={selectedStatus === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("all")}
      >
        Todos
      </Button>
      <Button
        variant={selectedStatus === "planning" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("planning")}
      >
        Planejamento
      </Button>
      <Button
        variant={selectedStatus === "in_progress" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("in_progress")}
      >
        Em Andamento
      </Button>
      <Button
        variant={selectedStatus === "completed" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("completed")}
      >
        Concluídos
      </Button>
    </div>
  );
}
