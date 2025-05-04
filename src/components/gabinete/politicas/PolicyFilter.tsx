
import React from "react";
import { Input } from "@/components/ui/input";
import { PolicyStatus } from "@/types/mayorOffice";
import { Button } from "@/components/ui/button";

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
  onSearchChange,
}: PolicyFilterProps) {
  return (
    <div>
      <Input
        placeholder="Buscar políticas..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full md:w-72"
      />
    </div>
  );
}

interface PolicyTabsProps {
  selectedStatus: PolicyStatus | "all";
  onStatusChange: (status: PolicyStatus | "all") => void;
}

export function PolicyTabs({ selectedStatus, onStatusChange }: PolicyTabsProps) {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant={selectedStatus === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("all")}
      >
        Todas
      </Button>
      <Button
        variant={selectedStatus === "active" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("active")}
      >
        Ativas
      </Button>
      <Button
        variant={selectedStatus === "draft" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("draft")}
      >
        Rascunhos
      </Button>
      <Button
        variant={selectedStatus === "completed" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("completed")}
      >
        Concluídas
      </Button>
    </div>
  );
}
