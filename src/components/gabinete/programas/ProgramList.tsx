
import React from "react";
import { Loader2 } from "lucide-react";
import { StrategicProgram } from "@/types/mayorOffice";
import { ProgramCard } from "./ProgramCard";
import { CardContent } from "@/components/ui/card";

interface ProgramListProps {
  programs: StrategicProgram[] | undefined;
  isLoading: boolean;
  searchQuery: string;
}

export function ProgramList({ programs, isLoading, searchQuery }: ProgramListProps) {
  // Filter programs by search query
  const filteredPrograms = programs?.filter((program) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      program.title.toLowerCase().includes(query) ||
      program.description.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!filteredPrograms || filteredPrograms.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl font-medium">Nenhum programa encontrado</p>
        <p className="text-muted-foreground mt-2">
          {searchQuery
            ? "Tente ajustar os critérios de busca"
            : "Crie um novo programa para começar"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredPrograms.map((program) => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </div>
  );
}
