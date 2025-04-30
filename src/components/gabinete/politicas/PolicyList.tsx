
import React from "react";
import { Loader2 } from "lucide-react";
import { PublicPolicy } from "@/types/mayorOffice";
import { PolicyCard } from "./PolicyCard";

interface PolicyListProps {
  policies: PublicPolicy[] | undefined;
  isLoading: boolean;
  searchQuery: string;
}

export function PolicyList({ policies, isLoading, searchQuery }: PolicyListProps) {
  // Filter policies by search query
  const filteredPolicies = policies?.filter((policy) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      policy.title.toLowerCase().includes(query) ||
      policy.description.toLowerCase().includes(query) ||
      policy.department.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!filteredPolicies || filteredPolicies.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl font-medium">Nenhuma política encontrada</p>
        <p className="text-muted-foreground mt-2">
          {searchQuery
            ? "Tente ajustar os critérios de busca"
            : "Crie uma nova política para começar"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredPolicies.map((policy) => (
        <PolicyCard key={policy.id} policy={policy} />
      ))}
    </div>
  );
}
