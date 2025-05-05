
import React from "react";
import { Button } from "@/components/ui/button";
import { AppointmentStatus } from "@/types/mayorOffice";

interface AppointmentFiltersProps {
  filterStatus: AppointmentStatus | "all";
  setFilterStatus: (status: AppointmentStatus | "all") => void;
}

export function AppointmentFilters({ 
  filterStatus, 
  setFilterStatus 
}: AppointmentFiltersProps) {
  return (
    <div className="flex items-center gap-4 mt-4">
      <Button
        variant={filterStatus === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilterStatus("all")}
      >
        Todos
      </Button>
      <Button
        variant={filterStatus === "pending" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilterStatus("pending")}
      >
        Pendentes
      </Button>
      <Button
        variant={filterStatus === "approved" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilterStatus("approved")}
      >
        Aprovados
      </Button>
      <Button
        variant={filterStatus === "completed" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilterStatus("completed")}
      >
        Concluídos
      </Button>
    </div>
  );
}
