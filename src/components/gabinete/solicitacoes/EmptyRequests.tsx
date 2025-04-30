
import React from "react";

interface EmptyRequestsProps {
  searchQuery: string;
}

export function EmptyRequests({ searchQuery }: EmptyRequestsProps) {
  return (
    <div className="text-center py-16">
      <p className="text-xl font-medium">Nenhuma solicitação encontrada</p>
      <p className="text-muted-foreground mt-2">
        {searchQuery
          ? "Tente ajustar os critérios de busca"
          : "Crie uma nova solicitação para começar"}
      </p>
    </div>
  );
}
