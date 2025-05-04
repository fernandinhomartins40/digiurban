
import React from "react";
import { Program } from "@/types/mayorOffice";
import { FileBarChart } from "lucide-react";

interface ProgramListProps {
  programs: Program[] | undefined;
  isLoading: boolean;
  searchQuery: string;
  onProgramClick?: (program: Program) => void;
}

interface ProgramCardProps {
  program: Program;
  onClick?: () => void; // Added onClick prop
}

export function ProgramCard({ program, onClick }: ProgramCardProps) {
  return (
    <div 
      className="border rounded-md p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <h3 className="font-medium text-lg">{program.name}</h3>
      {program.description && <p className="text-muted-foreground truncate mt-1">{program.description}</p>}
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-muted-foreground">{program.category}</span>
      </div>
    </div>
  );
}

export function ProgramList({ programs, isLoading, searchQuery, onProgramClick }: ProgramListProps) {
  // Filter programs by search query
  const filteredPrograms = programs?.filter(
    (program) =>
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.responsible?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!filteredPrograms || filteredPrograms.length === 0) {
    return (
      <div className="text-center py-8">
        <FileBarChart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
        <h3 className="text-lg font-medium">Nenhum programa encontrado</h3>
        <p className="text-muted-foreground mt-1">
          Não foram encontrados programas estratégicos com os critérios de busca informados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredPrograms.map((program) => (
        <ProgramCard 
          key={program.id} 
          program={program} 
          onClick={() => onProgramClick?.(program)} 
        />
      ))}
    </div>
  );
}
