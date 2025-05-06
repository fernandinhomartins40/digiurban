
import React from "react";

interface EmptyRequestsProps {
  searchQuery?: string;
}

export function EmptyRequests({ searchQuery = "" }: EmptyRequestsProps) {
  return (
    <div className="text-center py-16">
      <p className="text-xl font-medium">Nenhuma solicitação encontrada</p>
      {searchQuery && (
        <p className="text-sm text-muted-foreground mt-2">
          Não foram encontradas solicitações com o termo "{searchQuery}"
        </p>
      )}
      <p className="text-sm text-muted-foreground mt-2">
        Use o botão "Nova Solicitação" para criar uma nova solicitação
      </p>
    </div>
  );
}
